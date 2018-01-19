import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as opn from 'opn';
import { ICommandLineOptions } from './cli';
import { IInfo } from './models/info';
import { TileServer } from './tile-server';
import { IQuery } from './models/query';

const log = console.log;
const err = console.error;

export class Server {
  private mbtilesFiles: string[] = [];
  private tileInfos: { [key: string]: IInfo } = {};

  constructor(options: ICommandLineOptions) {
    process.on('SIGINT', () => {
      console.log('bye');
      process.exit(0);
    });

    const favicon = require('express-favicon');
    const app = express();
    app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
    app.use(express.static('public'));

    if (process.env.CSCOP_PORT) {
        options.port = process.env.MBTILES_PORT;
        log(`MBtiles server port overridden by env variable: ${options.port}.`);
    }

    if (options.mbtiles) {
      // Add all MBtiles files from command line
      options.mbtiles.forEach(mb => {
        this.mbtilesFiles.push(path.resolve(mb));
      });
    } else {
      // Get all MBtiles file in folder
      if (fs.existsSync(options.folder)) {
        fs.readdirSync(options.folder)
          .filter(f => { return path.extname(f) === '.mbtiles' })
          .map(f => { return this.mbtilesFiles.push(path.resolve(path.join(options.folder, f))); });
      }
    }

    if (this.mbtilesFiles.length === 0) {
      console.error('No mbtiles files found. Exiting now...');
      process.exit(1);
    }

    // For each MBtiles file, open a dedicated path (GET basename/zoom/x/y.png) and a pool of MBtiles TileServers.
    this.mbtilesFiles.forEach(m => {
      console.log(`Opening ${m}.`);

      let basename = path.basename(m);
      basename = basename.substr(0, basename.length - '.mbtiles'.length);

      let tileServer = new TileServer(m, options.concurrency, (info: IInfo) => {
        this.tileInfos[basename] = info;
      });

      app.get(`/${basename}/:z/:x/:y.*`, (req, res) => {
        let query = <IQuery>{
          x: +req.params.x,
          y: +req.params.y,
          z: +req.params.z,
          extension: req.params[0]
        };
        tileServer.serve(query, res);
      });
    });

    // Offer info to a user
    app.get('/info', (req, res) => {
      res.header("Content-Type", "text/json")
      res.send(JSON.stringify(this.tileInfos, null, 2));
    });

    // Create the server
    app.listen(options.port, () => {
      log(`MBtiles server started on port ${options.port}.`);
      log('Press CTRL-C to quit the application.');
      if (options.browser) {
        opn(`http://localhost:${options.port}`);
      }
    });
  }
}

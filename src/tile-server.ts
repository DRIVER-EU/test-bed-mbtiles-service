import * as path from 'path';
import * as express from 'express';
import { Pool } from './pool';
import { IInfo } from './models/info';
import { IQuery } from './models/query';
const MBTiles = require('mbtiles');

/**
 * The TileServer creates a pool of tile servers, each of which can serve a tile from an MBTiles source.
 * 
 * @export
 * @class TileServer
 */
export class TileServer {
  private servers: Pool;
  private tileInfo: IInfo;

  constructor(mbtilesFile: string, concurrency = 10, callback: (info: IInfo) => void) {
    let isFirst = true;
    this.servers = new Pool(() => {
      new MBTiles(mbtilesFile, (err, mbtiles) => {
        if (err) throw err;
        this.servers.release(mbtiles);
        if (isFirst) {
          isFirst = false;
          mbtiles.getInfo((err, info: IInfo) => {
            if (err) return console.error(err);
            info.scheme = 'xyz'; // is always reported as tms, which is incorrect.
            this.tileInfo = info;
            callback(info);
          });
        }
      });
    }, concurrency);
  }

  public serve(query: IQuery, res: express.Response) {
    this.servers.acquire(mbtiles => {
      process.nextTick(() => { this.servers.release(mbtiles); });
      var extension = query.extension;
      switch (extension) {
        case "png":
          mbtiles.getTile(query.z, query.x, query.y, (err, tile, headers) => {
            if (err) {
              res.status(404).send('Tile rendering error: ' + err + '\n');
            } else {
              res.header("Content-Type", "image/png")
              res.send(tile);
            }
          });
          break;
        case "grid.json":
          mbtiles.getGrid(query.z, query.x, query.y, (err, grid, headers) => {
            if (err) {
              res.status(404).send('Grid rendering error: ' + err + '\n');
            } else {
              res.header("Content-Type", "text/json")
              res.send(grid);
            }
          });
          break;
      }
    });
  }

  public get info() { return this.tileInfo; }
}
import * as path from 'path';
import { Server } from './server';

const commandLineArgs = require('command-line-args');

export interface ICommandLineOptions {
  /**
   * Input folder (default is `./mbtiles`)
   * 
   * @type {string}
   * @memberOf ICommandLineOptions
   */
  folder: string;
  /**
   * Port number
   * 
   * @type {number}
   * @memberOf ICommandLineOptions
   */
  port: number;
  /**
   * MBtiles file to open (if not present, use the folder for opening mbtiles)
   * 
   * @type {string}
   * @memberOf ICommandLineOptions
   */
  mbtiles: string[];
  /**
   * Show help information.
   * 
   * @type {boolean}
   * @memberOf ICommandLineOptions
   */
  help: boolean;
  /**
   * The number of concurrent tile servers (default 10)
   * 
   * @type {number}
   * @memberOf ICommandLineOptions
   */
  concurrency: number;
  /**
   * Start the browser automatically.
   * 
   * @type {boolean}
   * @memberOf ICommandLineOptions
   */
  browser: boolean;
}

export class CommandLineInterface {
  static optionDefinitions = [
    { name: 'help', alias: '?', type: Boolean, multiple: false, typeLabel: '[underline]{Help}', description: 'Display help information.' },
    { name: 'browser', alias: 'b', type: Boolean, multiple: false, typeLabel: '[underline]{Browser}', description: 'Open the browser automatically.' },
    { name: 'folder', alias: 'f', type: String, multiple: false, typeLabel: '[underline]{Mbtiles folder}', description: 'Folder that contains the mbtiles files (default ./mbtiles).', defaultValue: 'mbtiles' },
    { name: 'mbtiles', alias: 'm', type: String, multiple: true, defaultOption: true, typeLabel: '[underline]{Mbtiles file}', description: 'File that contains the mbtiles files to serve (default use ./mbtiles folder).' },
    { name: 'port', alias: 'p', type: Number, multiple: false, typeLabel: '[underline]{Port}', description: 'Port number (default 3456).', defaultValue: 3456 },
    { name: 'concurrency', alias: 'c', type: Number, multiple: false, typeLabel: '[underline]{Concurrency}', description: 'Number of concurrent mbtiles services (default 10).', defaultValue: 10 }
  ];

  static sections = [{
    header: 'MBtiles Server',
    content: 'Serve one or more MBtiles as a slippy map in xyz format.'
  }, {
    header: 'Options',
    optionList: CommandLineInterface.optionDefinitions
  }, {
    header: 'Examples',
    content: [{
        desc: '1. A concise example serving mbtiles from the ./mbtiles folder.',
        example: '$ mbtiles_server'
      }, {
        desc: '2. As above, but also opening a leaflet page in the browser, centering on the first mbtiles file.',
        example: '$ mbtiles_server -b'
      }, {
        desc: '3. Serve a specific mbtile file.',
        example: '$ mbtiles_server MY_FILE.mbtiles -b'
      }, {
        desc: '4. Serve another mbtile folder.',
        example: '$ mbtiles_server -f MY_MBTILES_FOLDER -b'
      }
    ]}
  ];
}

let options: ICommandLineOptions = commandLineArgs(CommandLineInterface.optionDefinitions);

if (options.help) {
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  process.exit(1);
}

if (!options || typeof options !== 'object') options = <ICommandLineOptions>{};
options.folder = path.resolve(options.folder);

const server = new Server(options);

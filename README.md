# mbtiles_server

This Node.js application acts as a simple MBtiles server. It opens one or more MBtiles files and serves them via express. Optionally, if available, it can also serve UTF grid files. By default, it creates 10 concurrent connections to each MBtiles file.  

[MBtiles](https://github.com/mapbox/mbtiles-spec) is a specification for storing tiled map data in SQLite databases for immediate usage and for transfer. MBTiles files, known as tilesets, must implement the specification below to ensure compatibility with devices. are a convenient way to package. 

There are several ways to create MBtiles files. You can use [TileMill](https://github.com/tilemill-project/tilemill) to create your own map and export it as MBtiles file. See also this [tutorial](http://geoodk.com/mbtiles_howto.php). Alternatively, you can use [MapTiler](http://www.maptiler.com) to create them from a number of sources.

# Installation

```console
npm i -g typings
npm i -g typescript
npm i
typings i
tsc
```

# Alternatives

- [TileServer PHP](https://github.com/klokantech/tileserver-php): MapTiler and MBTiles maps via WMTS. For a tutorial, see [here](http://osm2vectortiles.org/docs/start).
- [mbtiles-server](https://github.com/chelm/mbtiles-server): A very simple node.js server for mbtiles, which also served as an inspiration for this project.

# Usage

```console
MBtiles Server

  Serve one or more MBtiles as a slippy map in xyz format.

Options

  -?, --help Help                 Display help information.
  -b, --browser Browser           Open the browser automatically.
  -f, --folder Mbtiles folder     Folder that contains the mbtiles files (default ./mbtiles).
  -m, --mbtiles Mbtiles file      File that contains the mbtiles files to serve (default use ./mbtiles
                                  folder).
  -p, --port Port                 Port number (default 3344).
  -c, --concurrency Concurrency   Number of concurrent mbtiles services (default 10).

Examples

  1. A concise example serving mbtiles from the ./mbtiles    $ mbtiles_server
  folder.
  2. As above, but also opening a leaflet page in the        $ mbtiles_server -b
  browser, centering on the first mbtiles file.
  3. Serve a specific mbtile file.                           $ mbtiles_server MY_FILE.mbtiles -b
  4. Serve another mbtile folder.                            $ mbtiles_server -f MY_MBTILES_FOLDER -b
```
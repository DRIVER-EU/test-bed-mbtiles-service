/**
 * MBtiles info
 * 
 * @export
 * @interface IInfo
 */
export interface IInfo {
  scheme: string;
  basename: string;
  id: string;
  filesize: number;
  minzoom?: number;
  maxzoom?: number;
  center?: number[];
  bounds?: number[];
  [key: string]: any;
}
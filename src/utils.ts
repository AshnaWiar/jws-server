import {readFileSync} from 'fs'
import ErrnoException = NodeJS.ErrnoException;
import {FailedToLoadFile} from "./exceptions/failed-to-load-file.js";

export const loadFileSync = (filePath: string): string | undefined  => {
  try {
    return readFileSync(filePath, 'utf8')
  }catch (e) {
    throw new FailedToLoadFile(filePath, e as ErrnoException);
  }
}

export const truncate = (str: string, maxSize: number = 256)  =>{
  if (str.length <= maxSize) return str;
  return  str.slice(0, maxSize) + '...'
}


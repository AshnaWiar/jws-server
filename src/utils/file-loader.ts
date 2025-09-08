import {readFileSync} from 'fs'
import {FailedToLoadFile} from "../exceptions/failed-to-load-file.js";
import ErrnoException = NodeJS.ErrnoException;

export class FileLoader {
  loadSync(filePath: string): string | undefined {
    try {
      return readFileSync(filePath, 'utf8')
    }catch (e) {
      throw new FailedToLoadFile(filePath, e as ErrnoException);
    }
  }
}

export default new FileLoader()

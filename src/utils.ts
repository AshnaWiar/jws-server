import {readFileSync} from 'fs'
import ErrnoException = NodeJS.ErrnoException;
import {FailedToLoadFile} from "./exceptions/failed-to-load-file.js";

export const tryReadFileSync = (filePath: string): string | undefined  => {
  try {
    return readFileSync(filePath, 'utf8')
  }catch (e) {
    throw new FailedToLoadFile(filePath, e as ErrnoException);
  }
}

export const tryReadJSONFileSync = <T>(filePath: string): T => {
  const file = tryReadFileSync(filePath)!;
  return JSON.parse(file) as T;
};
export const escapeControlUnicode = (s: string) => {
  return s.replace(/\p{Cc}/gu, (c, hex) => {
    switch (c) {
      case '\b': return '\\b';
      case '\f': return '\\f';
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '\t': return '\\t';
      case '"':  return '\\"';
      case '\\': return '\\\\';
      case '/':  return '\\/';
      default:
        return '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0');
    }
  });
}

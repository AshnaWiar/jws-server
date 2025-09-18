import {RawData} from 'ws'
import {WebsocketEvent} from "./types/index.js";
import {WebsocketRequest} from "./websocket-request.js";
import {UnsupportedEventTypeException} from "../exceptions/unsupported-event-type.js";

export class WebsocketRequestParser {

  parseRequest(eventType: WebsocketEvent, ...args: unknown[]): Promise<WebsocketRequest> {
    return new Promise((resolve, reject) => {
      if (eventType !== 'message') {
        reject(new UnsupportedEventTypeException(eventType))
      }

      const data = args[0] as RawData;
      const isBinary = args[1] as boolean;

      resolve(this.parseMessageRequest(data, isBinary));
    })
  }

  parseMessageRequest(data: RawData, isBinary: boolean): WebsocketRequest {
    const buffer = this.normalizeBuffer(data)

    const payloadAsString = buffer.toString(isBinary ? 'hex' : 'utf8');
    const contentType = isBinary ? 'application/octet-stream' : 'text/plain'

    return new WebsocketRequest(buffer, payloadAsString, contentType)
  }

  private normalizeBuffer(data: RawData) {
    if (Buffer.isBuffer(data)) {
      return data
    }

    if (Array.isArray(data)) {
      return Buffer.concat(data)
    }

    return Buffer.from(data as ArrayBuffer)
  }
}

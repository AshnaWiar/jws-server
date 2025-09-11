import {WebsocketEvent} from "../websocket/types/index.js";

export class UnsupportedEventTypeException extends Error {
  private code: string;

  constructor(
    readonly evenType: WebsocketEvent
  ) {
    super(`Unsupported event type: "${evenType}"`);
    this.name = 'UnsupportedEventTypeException';
    this.code = 'WS.EVENT_TYPE.UNSUPPORTED';
  }

}

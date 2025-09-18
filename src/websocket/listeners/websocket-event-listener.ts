import {WebsocketEvent} from "../types/index.js";
import {WebsocketRequest} from "../websocket-request.js";
import {WebsocketResponse} from "../websocket-response.js";

export abstract class WebsocketEventListener {
  protected constructor(
    readonly eventType: WebsocketEvent,
  ) {
  }

  abstract handle(request: WebsocketRequest): Promise<WebsocketResponse | undefined>
}

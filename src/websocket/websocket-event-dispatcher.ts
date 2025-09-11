import {WebsocketRequestParser} from './websocket-request-parser.js'
import {WebsocketConnection} from "./websocket-connection.js";
import {WebsocketEventListener} from "./listeners/websocket-event-listener.js";
import {UnsupportedEventTypeException} from "../exceptions/unsupported-event-type.js";
import {WebsocketRequest} from "./domain/websocket-request.js";
import {WebsocketResponse} from "./domain/websocket-response.js";

export class WebsocketEventDispatcher {

  constructor(
    private readonly requestParser: WebsocketRequestParser
  ) {
  }

  async dispatch(conn: WebsocketConnection, listener: WebsocketEventListener, ...args: unknown[]): Promise<void> {

    let request: WebsocketRequest | undefined;
    let response: WebsocketResponse | undefined;

    try {
      request = await this.requestParser.parseRequest(listener.eventType, ...args);
      console.debug(`recv | ${conn.id} | ${listener.eventType} | ${request}`);

      response = await listener.handle(request);
      if (response == null) return;

      await conn.sendMessage(response.getPayload());
      console.debug(`send | ${conn.id} | ${listener.eventType} | ${response}`);

    } catch (err) {
      if (err instanceof UnsupportedEventTypeException) {
        console.error(`Received request for unsupported WebSocket event: ${err.evenType}`);
      } else {
        console.error('Failed to process WebSocket message', {
          connection: conn.id,
          eventType: listener.eventType,
          request: request ?? 'N/A',
          response: response ?? 'N/A',
          error: err,
        });
      }
    }



  }
}

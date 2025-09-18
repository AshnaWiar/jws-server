import {WebsocketRequestParser} from './websocket-request-parser.js'
import {WebsocketConnection} from "./websocket-connection.js";
import {WebsocketEventListener} from "./listeners/websocket-event-listener.js";
import {UnsupportedEventTypeException} from "../exceptions/unsupported-event-type.js";
import {WebsocketRequest} from "./websocket-request.js";
import {WebsocketResponse} from "./websocket-response.js";
import logger from "../logger.js";
import chalk from "chalk";

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
      logger.debug(chalk.dim(`${chalk.yellow('recv')} | ${conn.id} | ${listener.eventType} | ${request}`));

      response = await listener.handle(request);
      if (response == null) return;

      await conn.sendMessage(response.getPayload());
      logger.debug(`${chalk.green('send')} | ${conn.id} | ${listener.eventType} | ${chalk.yellow(request.id)} | ${response}`);

    } catch (err) {
      if (err instanceof UnsupportedEventTypeException) {
        logger.error(`Received request for unsupported WebSocket event: ${err.evenType}`);
      } else {
        logger.error('Failed to process WebSocket message', {
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

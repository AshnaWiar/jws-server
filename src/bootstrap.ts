import {ServerConfig} from "./websocket/server-config.js";
import {WebsocketSpec} from "./json-spec/websocket-spec.js";
import {WebsocketServer} from "./websocket/websocket-server.js";
import {WebsocketEventListener} from "./websocket/listeners/websocket-event-listener.js";
import {WebsocketMessageListener} from "./websocket/listeners/websocket-message-listener.js";
import {WebsocketRequestParser} from "./websocket/websocket-request-parser.js";
import {WebsocketEventDispatcher} from "./websocket/websocket-event-dispatcher.js";
import {WebsocketConnection} from "./websocket/websocket-connection.js";
import {WebSocketServer} from "ws";
import logger from "./logger.js";

export const createWebsocketServer = (config: ServerConfig, spec: WebsocketSpec) => {

  const listeners: WebsocketEventListener[] = []

  if (spec.messages) {
    listeners.push(new WebsocketMessageListener(spec.messages!))
  }

  const requestParser = new WebsocketRequestParser();
  const eventDispatcher = new WebsocketEventDispatcher(requestParser);

  return new WebsocketServer(config)
    .on('connection', (conn: WebsocketConnection) => {
      for (const listener of listeners) {
        conn.addSocketListener(
          listener.eventType,
          eventDispatcher.dispatch.bind(eventDispatcher, conn, listener)
        );
      }
    })
    .on('stop', async (server: WebSocketServer) => {
      if (server.clients.size === 0) {
        return;
      }

      for (const client of server.clients) {
        client.close(1001, 'Server shutting down')
      }

      logger.log(`(${server.clients.size}) active connections closed`)
    })
}

#!/usr/bin/env node

import {createCLIProgram, parseProgramOptions} from "./commander-program.js";
import {safeExecute} from "./exceptions/safe-execute.js";
import {WebsocketEvent} from "./websocket/types/index.js";
import {WebsocketConnection} from "./websocket/websocket-connection.js";
import {AddressInfo} from "node:net";
import {WebsocketServer} from "./websocket/websocket-server.js";
import {WebSocketServer} from "ws";
import {tryReadFileSync} from "./utils.js";
import {WebsocketSpec} from "./json-spec/websocket-spec.js";
import {createWebsocketServer} from "./bootstrap.js";

safeExecute(() => {

  const program = createCLIProgram()
  const config = parseProgramOptions(program);

  const serverConfig = {
    host: config.host,
    port: config.port,
  }

  const specFile = tryReadFileSync<WebsocketSpec>(config.pathToSpecFile);

  console.log(`${program.name()} ${program.version()} initialized`)
  console.log(`Parsed CLI args: '${process.argv.slice(2).join(' ')}'\n`);

  // ===== [ Application ] =====

  const server = createWebsocketServer(serverConfig, specFile)
    .on('listening', (server: WebSocketServer) => {
      const {address, port} = server.address() as AddressInfo

      const host = ['127.0.0.1', '::1'].includes(address) ? 'localhost' : address
      console.log(`WebSocket server listening on ws://${host}:${port}`)
      console.log(`\nPress 'Ctrl+C' to exit at any time\n`)
    })
    .on('connection', (conn: WebsocketConnection) => {
      console.info(`+ connection ${conn.id}`);

      (['close', 'terminate'] as WebsocketEvent[]).forEach(event => {
        conn.addSocketListener(event, (code, reason) => {
          console.info(`- connection ${conn.id}`, {
            code,
            reason: (reason as Buffer).toString(),
          });
        });
      });
    })
    .on('error', (err: Error) => {
      console.error('unexpected websocket error', err);
    })

  server.start()

  process.on('SIGINT', shutdown.bind(this, server));
  process.on('SIGTERM', shutdown.bind(this, server));
});

async function shutdown(server: WebsocketServer) {
  console.log('\nReceived interrupt signal. Initiating shutdown sequence...');

  try {
    await server.stop()
  } catch (err) {
    console.error('Error while closing server:', err);
  }
}

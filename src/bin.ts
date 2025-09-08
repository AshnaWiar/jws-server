#!/usr/bin/env node

import {createCLIProgram, parseProgramOptions} from "./cli/program.js";
import fileLoader from "./utils/file-loader.js";
import {WebsocketEvent} from "./websocket/types/index.js";
import {WebsocketConnection} from "./websocket/websocket-connection.js";
import {AddressInfo} from "node:net";
import {WebsocketServer} from "./websocket/websocket-server.js";
import {WebSocketServer} from "ws";

const program = createCLIProgram();
const config = parseProgramOptions(program);


try {
  const serverConfig = {
    host: config.host,
    port: config.port,
  }

  const specFile = fileLoader.loadSync(config.pathToSpecFile);
  console.log(specFile);

  console.log(`${program.name()} ${program.version()} initialized`)
  console.log(`Parsed CLI args: '${process.argv.slice(2).join(' ')}'\n`);

  // ===== [ Application ] =====

  const server = new WebsocketServer(serverConfig)
    .on('listening', (server: WebSocketServer) => {
      const {address, port} = server.address() as AddressInfo

      const host = ['127.0.0.1', '::1'].includes(address) ? 'localhost' : address
      console.log(`WebSocket server listening on ws://${host}:${port}`)
      console.log(`\nPress 'Ctrl+C' to exit at any time\n`)
    })
    .on('connection',  (conn: WebsocketConnection) => {
      console.info(`+ connection ${conn.id}`);

      (['close', 'terminate'] as WebsocketEvent[]).forEach(event => {
        conn.addSocketListener(event, (code, reason) => {
          console.info(`- connection ${conn.id}`, {
            code,
            reason: (reason as Buffer).toString(),
          });
        });
      });
    });

  server.start()

  process.on('SIGINT', shutdown.bind(this, server));
  process.on('SIGTERM', shutdown.bind(this, server));

} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}

async function shutdown(server: WebsocketServer)  {
  console.log('\nReceived interrupt signal. Initiating shutdown sequence...');

  try {
    await server.stop()
  } catch (err) {
    console.error('Error while closing server:', err);
  }
}

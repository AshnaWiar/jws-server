#!/usr/bin/env node

import {createCLIProgram, parseProgramOptions} from "./commander-program.js";
import {safeExecute} from "./exceptions/safe-execute.js";
import {WebsocketEvent} from "./websocket/types/index.js";
import {WebsocketConnection} from "./websocket/websocket-connection.js";
import {AddressInfo} from "node:net";
import {WebsocketServer} from "./websocket/websocket-server.js";
import {WebSocketServer} from "ws";
import {tryReadJSONFileSync} from "./utils.js";
import {WebsocketSpec} from "./json-spec/websocket-spec.js";
import {createWebsocketServer} from "./bootstrap.js";
import logger from "./logger.js";
import chalk from "chalk";

safeExecute(() => {

  const program = createCLIProgram()
  const config = parseProgramOptions(program);

  const serverConfig = {
    host: config.host,
    port: config.port,
  }

  const specFile = tryReadJSONFileSync<WebsocketSpec>(config.pathToSpecFile);

  logger.log(`${program.name()} ${program.version()} initialized`)
  logger.log(`Parsed CLI args: '${process.argv.slice(2).join(' ')}'\n`);
  logger.debug(`Debug mode is ${chalk.green('enabled')}`);

  // ===== [ Application ] =====

  const server = createWebsocketServer(serverConfig, specFile)
    .on('listening', (server: WebSocketServer) => {
      const {address, port} = server.address() as AddressInfo

      const host = ['127.0.0.1', '::1'].includes(address) ? 'localhost' : address
      logger.log(`WebSocket server listening on ${chalk.bold(`ws://${host}:${port}`)}`)
      logger.newline().log(`Press ${chalk.yellow('Ctrl+C')} to exit at any time\n`)
    })
    .on('connection', (conn: WebsocketConnection) => {
      logger.log(`${chalk.green('+')} connection ${conn.id}`);

      (['close', 'terminate'] as WebsocketEvent[]).forEach(event => {
        conn.addSocketListener(event, (code, reason) => {
          logger.log(`${chalk.yellow('-')} connection ${conn.id}`, {
            code,
            reason: (reason as Buffer).toString(),
          });
        });
      });
    })
    .on('stop', () => {
      logger.log('Stopping server...');
    })
    .on('error', (err: Error) => {
      logger.error('unexpected websocket error', err);
    })

  server.start()

  process.on('SIGINT', shutdown.bind(this, server));
  process.on('SIGTERM', shutdown.bind(this, server));
});

async function shutdown(server: WebsocketServer) {
  logger.newline(chalk.bold('Received interrupt signal. Initiating shutdown sequence...'));

  try {
    await server.stop()
  } catch (err) {
    logger.error('Error while closing server:', err);
  }
}

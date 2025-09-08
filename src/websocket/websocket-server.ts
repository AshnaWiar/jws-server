import {WebSocket, WebSocketServer as NodeWebsocketServer} from 'ws'
import {IncomingMessage} from 'http'

import {promisify} from 'node:util'
import EventEmitter from "node:events";
import {ServerConfig} from "./server-config.js";
import {WebsocketConnection} from "./websocket-connection.js";


export class WebsocketServer extends EventEmitter {
  private server?: NodeWebsocketServer

  constructor(
    private readonly config: ServerConfig
  ) {
    super()
  }

  start() {
    this.server = this.createWebsocketServer()
    this.emit('start', this.server)

    this.server.on('connection', this.onConnection.bind(this))
    this.server.on('listening', this.onListening.bind(this))
    this.server.on('close', this.onClose.bind(this))
    this.server.on('error', this.onError.bind(this))
  }

  async stop(): Promise<void> {

    if (!this.server) {
      return
    }

    console.log('Stopping active connections...')
    for (const client of this.server.clients as Set<WebSocket>) {
      client.close(1001, 'Shutting down')
    }

    const closeAsync = promisify(this.server.close).bind(this.server);
    await closeAsync();

    this.emit('stop', this.server)
  }

  private createWebsocketServer() {
    return new NodeWebsocketServer({
      port: this.config.port,
      host: this.config.host,
    })
  }

  private onConnection(socket: WebSocket, req: IncomingMessage) {
    const normalizedAddr = req.socket.remoteAddress === '127.0.0.1'
      ? '::1'
      : req.socket.remoteAddress;

    const connId = `${normalizedAddr}:${req.socket.remotePort}`
    const conn = new WebsocketConnection(connId, socket)

    this.emit('connection', conn)
  }

  private onListening(): void {
    this.emit('listening', this.server)
  }

  private onClose(): void {
    this.emit('close', this.server)
  }

  private onError(error: Error) {
    console.error('Websocket server Error:', error)
    this.emit('error', error)
  }
}

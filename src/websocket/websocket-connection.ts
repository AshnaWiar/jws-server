import {WebSocket} from 'ws'
import {WebsocketEvent} from "./types/index.js";


export class WebsocketConnection {

  constructor(
    readonly id: string,
    private readonly socket: WebSocket,
  ) {}

  addSocketListener(eventType: WebsocketEvent, listener: (...args: unknown[]) => void): void {
    this.socket.on(eventType, listener)
  }

}

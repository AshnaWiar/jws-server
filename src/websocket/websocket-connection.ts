import {WebSocket} from 'ws'
import {WebsocketEvent} from "./types/index.js";
import logger from "../logger.js";

export class WebsocketConnection {

  constructor(
    readonly id: string,
    private readonly socket: WebSocket,
  ) {
  }

  addSocketListener(eventType: WebsocketEvent, listener: (...args: unknown[]) => void): void {
    this.socket.on(eventType, listener)
  }

  sendMessage(data: Buffer | string) {
    if (this.socket.readyState !== WebSocket.OPEN) {
      logger.warn('Attempting to send a closed websocket connection');
      return;
    }

    return this.toPromise(this.socket.send, data)
  }

  private toPromise(
    func: (...args: any[]) => void,
    ...args: any[]
  ): Promise<void> {

    return new Promise((resolve, reject) => {
      func.call(this.socket, ...args, (err: Error) => (err ? reject(err) : resolve()));
    });
  }
}

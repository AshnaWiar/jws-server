import {WebsocketRequest} from '../domain/websocket-request.js'
import {WebsocketEventListener} from './websocket-event-listener.js'
import {WebsocketResponse} from "../domain/websocket-response.js";

export class WebsocketMessageListener extends WebsocketEventListener {

  constructor() {
    super('message')
  }

  async handle(request: WebsocketRequest): Promise<WebsocketResponse> {
    return new WebsocketResponse({
      payload: request.payloadAsString,
      contentType: request.contentType,
      encoding: request.contentType === 'text/plain' ? 'utf8' : 'hex'
    })
  }

}

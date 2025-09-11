import {WebsocketRequest} from '../domain/websocket-request.js'
import {WebsocketEventListener} from './websocket-event-listener.js'
import {WebsocketResponse} from "../domain/websocket-response.js";
import {WebsocketScenarioSpec} from "../../json-spec/websocket-spec.js";
import {PayloadSpec} from "../../json-spec/payload-spec.js";

export class WebsocketMessageListener extends WebsocketEventListener {

  private readonly comparatorMap = {
    'application/octet-stream': this.bufferComparator,
    'text/plain': this.defaultComparator,
  };

  constructor(
    private readonly scenarioSpec: WebsocketScenarioSpec[],
  ) {
    super('message')
  }

  async handle(request: WebsocketRequest): Promise<WebsocketResponse | undefined> {
    const comparator = this.comparatorMap[request.contentType]

    const spec = this.scenarioSpec
      .filter(s => s.content.contentType === request.contentType)
      .find(s => comparator(s.content, request))

    if (!spec) {
      return undefined;
    }

    return new WebsocketResponse(spec.response);
  }

  private bufferComparator(expected: PayloadSpec, actual: WebsocketRequest) {
    return actual.buffer.toString(expected.encoding) === expected.payload.toLowerCase();
  }

  private defaultComparator(expected: PayloadSpec, actual: WebsocketRequest) {
    return expected.payload === actual.payloadAsString
  }


}

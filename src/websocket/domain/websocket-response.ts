import {PayloadSpec} from "../../json-spec/payload-spec.js";
import {truncate} from "../../utils.js";

export class WebsocketResponse {

  private cachedPayload: string | Buffer | undefined;

  constructor(
    private readonly payloadSpec: PayloadSpec
  ) {}

  getPayload() {
    if (this.cachedPayload === undefined) {
      this.cachedPayload = this.computePayload();
    }

    return this.cachedPayload!;
  }

  private computePayload() {
    const payload = this.payloadSpec.payload;

    if (this.payloadSpec.contentType === 'text/plain') {
      return payload;
    }

    return Buffer.from(payload, this.payloadSpec.encoding)
  }


  [Symbol.toPrimitive](hint: 'string' | 'number' | 'default') {
    if (hint !== 'string') {
     return null
    }

    return this.toString()
  }

  toString(): string {
    const buffer = Buffer.from(this.payloadSpec.payload, this.payloadSpec.encoding)
    return `WebsocketResponse[size=${buffer.length}, encoding=${this.payloadSpec.encoding} payload=${truncate(this.payloadSpec.payload)}]`;
  }

}

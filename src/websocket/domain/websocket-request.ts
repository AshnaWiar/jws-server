import {ContentType} from "../../json-spec/payload-spec.js";
import {truncate} from "../../utils.js";

export class WebsocketRequest {

  readonly id: string;
  readonly hash: string;

  constructor(
    readonly buffer: Buffer,
    readonly payloadAsString: string,
    readonly contentType: ContentType
  ) {
    this.id = this.generateId();
    this.hash = this.generateHash(this.buffer);
  }

  toString() {
    const encoding = this.contentType === 'text/plain' ? 'utf8' : 'hex';

    return `WebsocketRequest[id=${this.id}, size=${this.buffer.length}, hash=${this.hash}, encoding=${encoding}, payload=${truncate(this.payloadAsString)}]`
  }

  [Symbol.toPrimitive](hint: 'string' | 'number' | 'default') {
    if (hint !== 'string') {
      return null
    }

    return this.toString();
  }

  private generateId(): string {
    return this.generateHash(Buffer.from(Date.now().toString()));
  }

  private generateHash(buffer: Buffer): string {
    let hash = 2166136261;

    for (const byte of buffer) {
      hash ^= byte;
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }

    return (hash >>> 0).toString(16);
  }
}

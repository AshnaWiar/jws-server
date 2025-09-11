export type ContentType = 'application/octet-stream' | 'text/plain'
export type Encoding =
  | 'base64'
  | 'hex'
  | 'ascii'
  | 'base64url'
  | 'utf8'

export interface PayloadSpec {
  payload: string
  contentType: ContentType
  encoding: Encoding
}

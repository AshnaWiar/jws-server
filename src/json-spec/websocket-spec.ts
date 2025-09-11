import {PayloadSpec} from './payload-spec.js'

export interface WebsocketScenarioSpec {
  content: PayloadSpec
  response: PayloadSpec
}

export interface WebsocketSpec {
  messages?: WebsocketScenarioSpec[]
}

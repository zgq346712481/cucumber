import { messages } from './index'
import AbstractToNdjsonStream from './AbstractToNdjsonStream'

/**
 * Transforms a stream of message objects to NDJSON
 */
export default class EnvelopeToNdjsonStream extends AbstractToNdjsonStream<
  messages.Envelope
> {
  constructor() {
    super((message: messages.Envelope) => {
      return message.toJSON()
    })
  }
}

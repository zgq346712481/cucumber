import { messages } from './index'
import AbstractFromNdjsonStream from './AbstractFromNdjsonStream'

/**
 * Transforms an NDJSON stream to a stream of Envelope objects
 */
export default class EnvelopeFromNdjsonStream extends AbstractFromNdjsonStream<
  messages.Envelope
> {
  constructor() {
    super((object: Record<string, any>) => messages.Envelope.fromObject(object))
  }
}

import { Transform, TransformCallback } from 'stream'
import { messages } from './index'

/**
 * Transforms a stream of Envelope objects to binary
 */
export default class EnvelopeToProtobufStream extends Transform {
  constructor() {
    super({ writableObjectMode: true, readableObjectMode: false })
  }

  public _transform(
    envelope: messages.Envelope,
    encoding: string,
    callback: TransformCallback
  ) {
    const chunk = messages.Envelope.encodeDelimited(envelope).finish()
    this.push(chunk)
    callback()
  }
}

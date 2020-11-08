import { Transform, TransformCallback } from 'stream'
import { Reader } from 'protobufjs'
import { messages } from './index'

/**
 * Transforms a binary stream to a stream of message objects
 */
export default class EnvelopeFromProtobufStream extends Transform {
  private buffer = Buffer.alloc(0)

  constructor() {
    super({ writableObjectMode: false, readableObjectMode: true })
  }

  public _transform(
    chunk: Buffer,
    encoding: string,
    callback: TransformCallback
  ): void {
    this.buffer = Buffer.concat([this.buffer, chunk])
    let finished = false
    do {
      try {
        const reader = Reader.create(this.buffer)
        const envelope = messages.Envelope.decodeDelimited(reader)
        this.push(envelope)
        this.buffer = this.buffer.slice(reader.pos)
        finished = true
      } catch (err) {
        if (err instanceof RangeError) {
          // The buffer doesn't have all the data yet. Keep reading.
          break
        } else {
          throw err
        }
      }
    } while (!finished)
    callback()
  }
}

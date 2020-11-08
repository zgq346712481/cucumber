import { messages } from '../src'
import { Transform } from 'stream'
import toArray from './toArray'
import assert = require('assert')

export default function verifyStreamContract(
  makeToEncodedStream: () => Transform,
  makeFromEncodedStream: () => Transform
) {
  describe('contract', () => {
    it('can be serialised over a stream', async () => {
      const toEncodedStream = makeToEncodedStream()
      const fromEncodedStream = makeFromEncodedStream()

      toEncodedStream.pipe(fromEncodedStream)

      const outgoingMessages: messages.IEnvelope[] = [
        messages.Envelope.create({
          source: messages.Source.create({ data: 'Feature: Hello' }),
        }),
        messages.Envelope.create({
          attachment: messages.Attachment.create({
            body: 'hello',
          }),
        }),
      ]

      for (const outgoingMessage of outgoingMessages) {
        toEncodedStream.write(outgoingMessage)
      }
      toEncodedStream.end()

      const incomingMessages = await toArray(fromEncodedStream)

      assert.deepStrictEqual(incomingMessages, outgoingMessages)
    })
  })
}

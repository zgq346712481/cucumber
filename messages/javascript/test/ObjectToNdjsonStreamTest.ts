import { messages } from '../src'
import assert from 'assert'
import toArray from './toArray'
import ObjectFromNdjsonStream from '../src/ObjectFromNdjsonStream'
import ObjectToNdjsonStream from '../src/ObjectToNdjsonStream'

describe('ObjectToNdjsonStreamTest', () => {
  const makeToEncodedStream = () => new ObjectToNdjsonStream()
  const makeFromEncodedStream = () => new ObjectFromNdjsonStream()
  // verifyStreamContract(makeToEncodedStream, makeFromEncodedStream)

  it('converts a buffer stream written byte by byte', (cb) => {
    const stream = makeFromEncodedStream()
    const envelope = messages.Envelope.create({
      testStepFinished: messages.TestStepFinished.create({
        testStepResult: messages.TestStepFinished.TestStepResult.create({
          status: messages.TestStepFinished.TestStepResult.Status.UNKNOWN,
        }),
      }),
    }).toJSON()
    stream.on('error', cb)
    stream.on('data', (receivedEnvelope: messages.IEnvelope) => {
      assert.deepStrictEqual(envelope, receivedEnvelope)
      cb()
    })

    const json = JSON.stringify(envelope)
    const buffer = Buffer.from(json)
    for (let i = 0; i < buffer.length; i++) {
      stream.write(buffer.slice(i, i + 1))
    }
    stream.end()
  })

  it('converts messages to JSON with enums as strings', (cb) => {
    const stream = makeToEncodedStream()
    stream.on('data', (json: string) => {
      const ob = JSON.parse(json)
      assert.deepStrictEqual(ob, {
        testStepFinished: {
          testStepResult: {
            status: 'UNKNOWN',
          },
        },
      })
      cb()
    })
    stream.write(
      messages.Envelope.create({
        testStepFinished: messages.TestStepFinished.create({
          testStepResult: messages.TestStepFinished.TestStepResult.create({
            status: messages.TestStepFinished.TestStepResult.Status.UNKNOWN,
          }),
        }),
      }).toJSON()
    )
  })

  it('converts messages to JSON with undefined arrays omitted', (cb) => {
    const stream = makeToEncodedStream()
    stream.on('data', (json: string) => {
      const ob = JSON.parse(json)
      assert.deepStrictEqual(ob, { testCase: { pickleId: '123' } })
      cb()
    })
    stream.write(
      messages.Envelope.create({
        testCase: messages.TestCase.create({
          pickleId: '123',
        }),
      }).toJSON()
    )
  })

  it('converts messages to JSON with undefined strings omitted', (cb) => {
    const stream = makeToEncodedStream()
    stream.on('data', (json: string) => {
      const ob = JSON.parse(json)
      assert.deepStrictEqual(ob, { testCase: {} })
      cb()
    })
    stream.write(
      messages.Envelope.create({
        testCase: messages.TestCase.create({ pickleId: '' }),
      }).toJSON()
    )
  })

  it('converts messages to JSON with undefined numbers omitted', (cb) => {
    const stream = makeToEncodedStream()
    stream.on('data', (json: string) => {
      const ob = JSON.parse(json)
      assert.deepStrictEqual(ob, {
        gherkinDocument: {
          feature: {
            location: {
              column: 1,
            },
          },
        },
      })
      cb()
    })
    stream.write(
      messages.Envelope.create({
        gherkinDocument: messages.GherkinDocument.create({
          feature: messages.GherkinDocument.Feature.create({
            location: messages.Location.create({
              column: 1,
            }),
          }),
        }),
      }).toJSON()
    )
  })

  it('ignores empty lines', async () => {
    const toMessageStream = makeFromEncodedStream()
    toMessageStream.write('{}\n{}\n\n{}\n')
    toMessageStream.end()

    const incomingMessages = await toArray(toMessageStream)

    assert.deepStrictEqual(incomingMessages, [{}, {}, {}])
  })
})

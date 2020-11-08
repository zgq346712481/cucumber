import { EnvelopeFromProtobufStream, EnvelopeToProtobufStream } from '../src'
import verifyStreamContract from './verifyStreamContract'

describe('EnvelopeToProtobufStreamTest', () => {
  const makeToEncodedStream = () => new EnvelopeToProtobufStream()
  const makeFromEncodedStream = () => new EnvelopeFromProtobufStream()
  verifyStreamContract(makeToEncodedStream, makeFromEncodedStream)
})

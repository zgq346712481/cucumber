import { Readable } from 'stream'
import { messages } from '../src'

export default function toArray(
  input: Readable
): Promise<readonly messages.IEnvelope[]> {
  return new Promise((resolve, reject) => {
    const envelopes: messages.IEnvelope[] = []
    input.on('data', (envelope: messages.IEnvelope) => envelopes.push(envelope))
    input.on('end', () => resolve(envelopes))
    input.on('error', (err: Error) => reject(err))
  })
}

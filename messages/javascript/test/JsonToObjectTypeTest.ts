import { messages } from '../src'
import assert from 'assert'

const Status = {
  UNKNOWN: 0,
  PASSED: 1,
  SKIPPED: 2,
  PENDING: 3,
  UNDEFINED: 4,
  AMBIGUOUS: 5,
  FAILED: 6,
}

function reviver(key: string, value: any): any {
  if (key === 'status') {
    // @ts-ignore
    return Status[value]
  }
  return value
}

describe('NdjsonToObjectType', () => {
  it('produces JavaScript objects compatible with Envelope', () => {
    const envelope = messages.Envelope.create({
      testStepFinished: messages.TestStepFinished.create({
        testStepResult: messages.TestStepFinished.TestStepResult.create({
          status: messages.TestStepFinished.TestStepResult.Status.UNKNOWN,
        }),
      }),
    })

    const envelope2: messages.IEnvelope = JSON.parse(
      JSON.stringify(envelope.toJSON()),
      reviver
    )

    assert.strictEqual(
      envelope.testStepFinished.testStepResult.status,
      envelope2.testStepFinished.testStepResult.status
    )
  })
})

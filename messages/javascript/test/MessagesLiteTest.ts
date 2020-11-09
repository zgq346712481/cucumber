import { messages } from '../src'
import * as messagesLight from '../src/messagesLight'
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

const ContentEncoding = {
  IDENTITY: 0,
  BASE64: 1,
}

const StepDefinitionPatternType = {
  CUCUMBER_EXPRESSION: 0,
  REGULAR_EXPRESSION: 1,
}

function reviver(key: string, value: any): any {
  if (key === 'status') {
    // @ts-ignore
    return Status[value]
  }
  if (key === 'contentEncoding') {
    // @ts-ignore
    return ContentEncoding[value]
  }
  if (key === 'type') {
    // @ts-ignore
    return StepDefinitionPatternType[value]
  }
  return value
}

describe('MessagesLight', () => {
  it('are compatible with Status enums', () => {
    const envelope = messages.Envelope.create({
      testStepFinished: messages.TestStepFinished.create({
        testStepResult: messages.TestStepFinished.TestStepResult.create({
          status: messages.TestStepFinished.TestStepResult.Status.UNKNOWN,
        }),
      }),
    })

    const envelope2: messagesLight.IEnvelope = JSON.parse(
      JSON.stringify(envelope.toJSON()),
      reviver
    )

    assert.strictEqual(
      envelope.testStepFinished.testStepResult.status,
      envelope2.testStepFinished.testStepResult.status
    )
  })

  it('are compatible with ContentEncoding enums', () => {
    const attachment = messages.Attachment.create({
      contentEncoding: ContentEncoding.BASE64,
    })

    const attachment2: messagesLight.IAttachment = JSON.parse(
      JSON.stringify(attachment.toJSON()),
      reviver
    )

    assert.strictEqual(attachment.contentEncoding, attachment2.contentEncoding)
  })

  it('are compatible with StepDefinitionPatternType enums', () => {
    const stepDefinitionPattern = messages.StepDefinition.StepDefinitionPattern.create(
      {
        type: StepDefinitionPatternType.REGULAR_EXPRESSION,
      }
    )

    const stepDefinitionPattern2: messagesLight.StepDefinition.IStepDefinitionPattern = JSON.parse(
      JSON.stringify(stepDefinitionPattern.toJSON()),
      reviver
    )

    assert.strictEqual(stepDefinitionPattern.type, stepDefinitionPattern2.type)
  })
})

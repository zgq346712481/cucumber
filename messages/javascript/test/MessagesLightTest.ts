import { messages, messagesLight, messagesLightReviver } from '../src'
import assert from 'assert'

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
      messagesLightReviver
    )

    assert.strictEqual(
      envelope.testStepFinished.testStepResult.status,
      envelope2.testStepFinished.testStepResult.status
    )
  })

  it('are compatible with ContentEncoding enums', () => {
    const attachment = messages.Attachment.create({
      contentEncoding: messages.Attachment.ContentEncoding.BASE64,
    })

    const attachment2: messagesLight.IAttachment = JSON.parse(
      JSON.stringify(attachment.toJSON()),
      messagesLightReviver
    )

    assert.strictEqual(attachment.contentEncoding, attachment2.contentEncoding)
  })

  it('are compatible with StepDefinitionPatternType enums', () => {
    const stepDefinitionPattern = messages.StepDefinition.StepDefinitionPattern.create(
      {
        type:
          messages.StepDefinition.StepDefinitionPattern
            .StepDefinitionPatternType.REGULAR_EXPRESSION,
      }
    )

    const stepDefinitionPattern2: messagesLight.StepDefinition.IStepDefinitionPattern = JSON.parse(
      JSON.stringify(stepDefinitionPattern.toJSON()),
      messagesLightReviver
    )

    assert.strictEqual(stepDefinitionPattern.type, stepDefinitionPattern2.type)
  })
})

/**
 * Reviver function for JSON.parse that will build objects compatible with messagesLight.
 */
export default function reviver(key: string, value: any): any {
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

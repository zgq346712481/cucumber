import AbstractToNdjsonStream from './AbstractToNdjsonStream'

/**
 * Transforms a stream of plain old JavaScript objects to NDJSON
 */
export default class ObjectToNdjsonStream extends AbstractToNdjsonStream<
  Record<string, any>
> {
  constructor() {
    super((message: Record<string, any>) => message)
  }
}

import AbstractFromNdjsonStream from './AbstractFromNdjsonStream'

/**
 * Transforms an NDJSON stream to a stream of JavaScript objects
 */
export default class ObjectFromNdjsonStream extends AbstractFromNdjsonStream<
  Record<string, any>
> {
  constructor() {
    super((object: Record<string, any>) => object)
  }
}

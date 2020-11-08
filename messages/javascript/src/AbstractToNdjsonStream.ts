import { Transform, TransformCallback } from 'stream'

type ToObject<T> = (object: T) => Record<string, any>

export default abstract class AbstractToNdjsonStream<T> extends Transform {
  protected constructor(private readonly toObject: ToObject<T>) {
    super({ writableObjectMode: true, readableObjectMode: false })
  }

  public _transform(message: T, encoding: string, callback: TransformCallback) {
    const object = this.toObject(message)

    // This reviver omits printing fields with empty values
    // This is to make it behave the same as Golang's protobuf->JSON converter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = JSON.stringify(object, (key: string, value: any) => {
      return value === '' ? undefined : value
    })
    this.push(json + '\n')
    callback()
  }
}

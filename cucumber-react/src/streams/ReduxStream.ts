import {Writable} from "stream"
import {MiddlewareAPI} from "redux"
import {ActionTypes, IAppDispatch} from "../actions"
import {io} from "cucumber-messages"
import IWrapper = io.cucumber.messages.IWrapper

/**
 * This stream reads cucumber messages and dispatches
 * Redux actions accordingly.
 */
export default class extends Writable {
  private api: MiddlewareAPI<IAppDispatch>

  constructor(api: MiddlewareAPI<IAppDispatch>) {
    super({objectMode: true})
    this.api = api
  }

  public _write(
    wrapper: IWrapper,
    _: string,
    callback: (error?: Error | null) => void
  ): void {
    for (const messageType of Object.getOwnPropertyNames(wrapper)) {
      const message = Reflect.get(wrapper, messageType)
      this.api.dispatch({
        type: ActionTypes.CUCUMBER_MESSAGE,
        messageType,
        message
      })
    }
    callback()
  }
}

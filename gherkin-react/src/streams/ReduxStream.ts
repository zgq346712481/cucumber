import {Writable} from "stream";
import {MiddlewareAPI} from "redux";
import {ActionTypes, AppDispatch} from "../actions";
import {io} from "cucumber-messages";
import IWrapper = io.cucumber.messages.IWrapper;

/**
 * This stream reads cucumber messages and dispatches
 * Redux actions accordingly.
 */
export default class extends Writable {
    private _api: MiddlewareAPI<AppDispatch>;

    constructor(api: MiddlewareAPI<AppDispatch>) {
        super({objectMode: true})
        this._api = api;
    }

    _write(wrapper: IWrapper, _: string, callback: (error?: (Error | null)) => void): void {
        for (const messageType of Object.getOwnPropertyNames(wrapper)) {
            const message = Reflect.get(wrapper, messageType);
            this._api.dispatch({
                type: ActionTypes.CUCUMBER_MESSAGE,
                messageType,
                message,
            })
        }
        callback()
    }
}

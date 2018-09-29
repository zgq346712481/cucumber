import {Dispatch, Middleware, MiddlewareAPI} from "redux"
import {io} from "cucumber-messages"
import {
    ActionTypes,
    AppAction,
    IAppDispatch,
    ILoadMessagesAction,
    IReduxWebSocketMiddlewareMessageAction
} from "../actions"
import IApplicationState from "../IApplicationState"
import MessageStream from "../streams/MessageStream"
import ReduxStream from "../streams/ReduxStream"
import IWrapper = io.cucumber.messages.IWrapper;

// https://patrickdesjardins.com/blog/how-to-create-a-typed-redux-middleware-in-typescript
export default interface ICucumberMessagesMiddleware<StateType>
    extends Middleware<IWrapper, IApplicationState, IAppDispatch> {
    <S extends StateType>(api: MiddlewareAPI<IAppDispatch>): (
        dispatch: Dispatch<AppAction>
    ) => Dispatch<AppAction>
}

export const dispatchActionsFromStreamedMessages: ICucumberMessagesMiddleware<IApplicationState> =
    <S extends IApplicationState>(api: MiddlewareAPI<IAppDispatch>) => (
        next: Dispatch<AppAction>
    ) => <A extends AppAction>(action: A): A => {
        console.log("ACTION", action)
        switch (action.type) {
            case ActionTypes.WEBSOCKET_EVENT_MESSAGE: {
                const rw = action as IReduxWebSocketMiddlewareMessageAction
                new MessageStream(rw.payload.event.data as Uint8Array)
                // tslint:disable-next-line: no-console
                    .on("error", (err: Error) => console.error(err.stack))
                    .pipe(new ReduxStream(api))
                    // tslint:disable-next-line: no-console
                    .on("error", (err: Error) => console.error(err.stack))
                break
            }
            case ActionTypes.LOAD_MESSAGES: {
                const a = action as ILoadMessagesAction
                new MessageStream(a.data)
                // tslint:disable-next-line: no-console
                    .on("close", () => console.log("Stream closed"))
                    // tslint:disable-next-line: no-console
                    .on("error", (err: Error) => console.error(err.stack))
                    .pipe(new ReduxStream(api))
                    // tslint:disable-next-line: no-console
                    .on("error", (err: Error) => console.error(err.stack))
                break
            }
            default: {
                // ignore
            }
        }
        return next(action)
    }

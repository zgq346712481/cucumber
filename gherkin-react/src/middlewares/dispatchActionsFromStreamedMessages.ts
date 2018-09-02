import {Dispatch, Middleware, MiddlewareAPI} from "redux"
import {io} from "cucumber-messages";
import {
    ActionTypes,
    AppAction,
    AppDispatch,
    LoadMessagesAction,
    ReduxWebSocketMiddlewareMessageAction
} from "../actions";
import ApplicationState from "../ApplicationState";
import MemoryStream from "../streams/MemoryStream";
import ReduxStream from "../streams/ReduxStream";
import makeStream from "../streams/makeStream";
import IWrapper = io.cucumber.messages.IWrapper;

// https://patrickdesjardins.com/blog/how-to-create-a-typed-redux-middleware-in-typescript
export default interface CucumberMessagesMiddleware<StateType> extends Middleware<IWrapper, ApplicationState, AppDispatch> {
    <S extends StateType>(api: MiddlewareAPI<AppDispatch>): (dispatch: Dispatch<AppAction>) => Dispatch<AppAction>;
}

export const dispatchActionsFromStreamedMessages: CucumberMessagesMiddleware<ApplicationState> = <S extends ApplicationState>(api: MiddlewareAPI<AppDispatch>) =>
    (next: Dispatch<AppAction>) =>
        <A extends AppAction>(action: A): A => {
            switch (action.type) {
                case ActionTypes.WEBSOCKET_EVENT_MESSAGE: {
                    const rw = action as ReduxWebSocketMiddlewareMessageAction
                    new MemoryStream(rw.payload.event.data as Uint8Array)
                        .on("error", (err:Error) => console.error(err.stack))
                        .pipe(new ReduxStream(api))
                        .on("error", (err:Error) => console.error(err.stack))
                    break
                }
                case ActionTypes.LOAD_MESSAGES: {
                    const a = (action as LoadMessagesAction)
                    const stream = makeStream(a)
                    stream.on("error", (err: Error) => {
                        console.error("Stream error", err)
                    })
                    stream.on("close", () => {
                        console.log("Stream closed")
                    })
                    stream.pipe(new ReduxStream(api))
                        .on("error", (err:Error) => console.error(err.stack))
                    break
                }
                default: {
                    // ignore
                }
            }
            return next(action);
        };
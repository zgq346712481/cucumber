import {AnyAction, Dispatch} from "redux";
import {io} from "cucumber-messages";

// https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/

export enum ActionTypes {
    LOAD_MESSAGES = 'LOAD_MESSAGES',
    CUCUMBER_MESSAGE = 'CUCUMBER_MESSAGE',

    // redux-websocket-middleware
    WEBSOCKET_EVENT_MESSAGE = 'WEBSOCKET/EVENT/MESSAGE'
}

export interface LoadMessagesAction {
    type: ActionTypes.LOAD_MESSAGES;
    data?: Uint8Array;
    url?: string;
}

export interface CucumberMessageAction {
    type: ActionTypes.CUCUMBER_MESSAGE;
    messageType: string;
    message: any;
}

export interface ReduxWebSocketMiddlewareMessageAction {
    type: ActionTypes.WEBSOCKET_EVENT_MESSAGE,
    payload: ReduxWebSocketMiddlewarePayload
}

interface ReduxWebSocketMiddlewarePayload {
    id: string,
    event: ReduxWebSocketMiddlewareEvent
}

interface ReduxWebSocketMiddlewareEvent {
    type: string,
    data: Uint8Array | string
}

export type AppAction = AnyAction | LoadMessagesAction | CucumberMessageAction | ReduxWebSocketMiddlewareMessageAction

export interface AppDispatch extends Dispatch<AppAction> {
}

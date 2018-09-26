import {AnyAction, Dispatch} from "redux";
import {io} from "cucumber-messages";

// https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/

export enum ActionTypes {
    LOAD_MESSAGES = 'LOAD_MESSAGES',
    CUCUMBER_MESSAGE = 'CUCUMBER_MESSAGE',

    // redux-websocket-middleware
    WEBSOCKET_EVENT_MESSAGE = 'WEBSOCKET/EVENT/MESSAGE',

    // User actions
    SHOW_DOCUMENT = 'SHOW_DOCUMENT'
}

export interface ILoadMessagesAction {
    type: ActionTypes.LOAD_MESSAGES;
    data?: Uint8Array;
    url?: string;
}

export interface ICucumberMessageAction {
    type: ActionTypes.CUCUMBER_MESSAGE;
    messageType: string;
    message: any;
}

export interface IReduxWebSocketMiddlewareMessageAction {
    type: ActionTypes.WEBSOCKET_EVENT_MESSAGE,
    payload: IReduxWebSocketMiddlewarePayload
}

export interface IReduxWebSocketMiddlewarePayload {
    id: string,
    event: IReduxWebSocketMiddlewareEvent
}

export interface IReduxWebSocketMiddlewareEvent {
    type: string,
    data: Uint8Array | string
}

export interface IShowDocumentAction {
    type: ActionTypes.SHOW_DOCUMENT,
    url: string
}

export type AppAction =
    AnyAction |
    ILoadMessagesAction |
    ICucumberMessageAction |
    IReduxWebSocketMiddlewareMessageAction |
    IShowDocumentAction

export interface IAppDispatch extends Dispatch<AppAction> {
}

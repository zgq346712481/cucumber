import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import {io} from "cucumber-messages";
import reducer from './reducers'
import {ActionTypes} from "./actions";
import {dispatchActionsFromStreamedMessages} from "./middlewares/dispatchActionsFromStreamedMessages";
import {CucumberGui} from "./components/CucumberGui";
import uint8ArrayFromBinaryString from "./streams/uint8ArrayFromBinaryString";
import {ErrorBoundary} from "./components/ErrorBoundary";

const store = createStore(reducer, applyMiddleware(dispatchActionsFromStreamedMessages))

ReactDOM.render(
    <ErrorBoundary>
        <Provider store={store}>
            <CucumberGui/>
        </Provider>
    </ErrorBoundary>,
    document.getElementById("app")
);

const base64 = document.getElementById("messages").innerText;
const binaryString = window.atob(base64)
const data = uint8ArrayFromBinaryString(binaryString)

store.dispatch(({
    type: ActionTypes.LOAD_MESSAGES,
    data
}))

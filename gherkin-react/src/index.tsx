import * as React from "react"
import * as ReactDOM from "react-dom"
import {ErrorBoundary} from "./components/ErrorBoundary"
import "typeface-roboto"
import App from "./components/App";
import {Provider} from "react-redux";
import {dispatchActionsFromStreamedMessages} from "./middlewares/dispatchActionsFromStreamedMessages";
import {applyMiddleware, createStore} from "redux";
import uint8ArrayFromBinaryString from "./streams/uint8ArrayFromBinaryString";
import {ActionTypes} from "./actions";
import reducer from "./reducers"

const store = createStore(
    reducer,
    applyMiddleware(dispatchActionsFromStreamedMessages)
)

ReactDOM.render(
    <ErrorBoundary color={"pink"}>
        <Provider store={store}>
            <App/>
        </Provider>
    </ErrorBoundary>,
    document.getElementById("app")
)

const $messages = document.getElementById("cucumber-messages");
if ($messages && $messages.innerText) {
    const base64 = $messages.innerText
    const binaryString = window.atob(base64)
    const data = uint8ArrayFromBinaryString(binaryString)
    console.log('DATA', data)

    store.dispatch({
        type: ActionTypes.LOAD_MESSAGES,
        data: 'JALLA',
        // data
    })
}

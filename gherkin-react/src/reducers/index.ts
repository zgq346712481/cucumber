import {io} from "cucumber-messages";
import {ActionTypes, AppAction, CucumberMessageAction, ShowDocumentAction} from "../actions";
import {Map} from "immutable"
import ApplicationState from "../ApplicationState";
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;

const defaultState: ApplicationState = {
    gherkinDocumentUri: null,
    gherkinDocuments: Map<string, IGherkinDocument>()
}

export default (state: ApplicationState = defaultState, action: AppAction): ApplicationState => {
    switch (action.type) {
        case ActionTypes.CUCUMBER_MESSAGE: {
            const a = action as CucumberMessageAction
            if (a.messageType === 'gherkinDocument') {
                // TODO: Split this up in 2 combined reducers
                return {
                    gherkinDocumentUri: a.message.uri,
                    gherkinDocuments: state.gherkinDocuments.set(a.message.uri, a.message)
                }
            }
            return state
        }
        case ActionTypes.SHOW_DOCUMENT: {
            const a = action as ShowDocumentAction
            return {
                gherkinDocumentUri: a.url,
                gherkinDocuments: state.gherkinDocuments
            }
        }

        default:
            return state
    }
}
import {io} from "cucumber-messages";
import {ActionTypes, AppAction, CucumberMessageAction, ShowDocumentAction} from "../actions";
import {List, Map} from "immutable"
import ApplicationState from "../ApplicationState";
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;
import IPickle = io.cucumber.messages.IPickle;

// TODO: Use Immutable.js here? Might simplify reducers
const defaultState: ApplicationState = {
    gherkinDocumentUri: null,
    gherkinDocuments: Map<string, IGherkinDocument>(),
    pickles: Map<string, List<IPickle>>()
}

export default (state: ApplicationState = defaultState, action: AppAction): ApplicationState => {
    switch (action.type) {
        case ActionTypes.CUCUMBER_MESSAGE: {
            const a = action as CucumberMessageAction
            if (a.messageType === 'gherkinDocument') {
                const gherkinDocument = a.message as IGherkinDocument

                // TODO: Split this up in 2 combined reducers
                return {
                    gherkinDocumentUri: gherkinDocument.uri,
                    gherkinDocuments: state.gherkinDocuments.set(gherkinDocument.uri, gherkinDocument),
                    pickles: state.pickles
                }
            } else if (a.messageType === 'pickle') {
                const pickle = a.message as IPickle
                console.log("PICKLE", pickle)
                if (!state.pickles.has(pickle.uri)) {
                    state.pickles = state.pickles.set(pickle.uri, List())
                }
                return {
                    gherkinDocumentUri: state.gherkinDocumentUri,
                    gherkinDocuments: state.gherkinDocuments.set(pickle.uri, pickle),
                    pickles: state.pickles.update(pickle.uri, pickles => pickles.push(pickle))
                }
            }

            return state
        }
        case ActionTypes.SHOW_DOCUMENT: {
            const a = action as ShowDocumentAction
            return {
                gherkinDocumentUri: a.url,
                gherkinDocuments: state.gherkinDocuments,
                pickles: state.pickles
            }
        }

        default:
            return state
    }
}
import { io } from "cucumber-messages"
import {
  ActionTypes,
  AppAction,
  ICucumberMessageAction,
  IShowDocumentAction
} from "../actions"
import { List, Map } from "immutable"
import IApplicationState from "../IApplicationState"
import IGherkinDocument = io.cucumber.messages.IGherkinDocument
import IPickle = io.cucumber.messages.IPickle

// TODO: Use Immutable.js here? Might simplify reducers
const defaultState: IApplicationState = {
  gherkinDocumentUri: null,
  gherkinDocuments: Map<string, IGherkinDocument>(),
  pickles: Map<string, List<IPickle>>()
}

export default (
  state: IApplicationState = defaultState,
  action: AppAction
): IApplicationState => {
  switch (action.type) {
    case ActionTypes.CUCUMBER_MESSAGE: {
      const a = action as ICucumberMessageAction
      if (a.messageType === "gherkinDocument") {
        const gherkinDocument = a.message as IGherkinDocument

        // TODO: Split this up in 2 combined reducers
        return {
          gherkinDocumentUri: gherkinDocument.uri,
          gherkinDocuments: state.gherkinDocuments.set(
            gherkinDocument.uri,
            gherkinDocument
          ),
          pickles: state.pickles
        }
      } else if (a.messageType === "pickle") {
        const pickle = a.message as IPickle
        if (!state.pickles.has(pickle.uri)) {
          state.pickles = state.pickles.set(pickle.uri, List())
        }
        return {
          gherkinDocumentUri: state.gherkinDocumentUri,
          gherkinDocuments: state.gherkinDocuments.set(pickle.uri, pickle),
          pickles: state.pickles.update(pickle.uri, pickles =>
            pickles.push(pickle)
          )
        }
      }

      return state
    }
    case ActionTypes.SHOW_DOCUMENT: {
      const a = action as IShowDocumentAction
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

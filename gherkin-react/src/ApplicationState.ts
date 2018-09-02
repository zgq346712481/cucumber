import {io} from "cucumber-messages";
import {Map} from 'immutable'
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;

export default interface ApplicationState {
    gherkinDocumentUri: string | null,
    gherkinDocuments: Map<string, IGherkinDocument>
}

// https://medium.com/knerd/typescript-tips-series-proper-typing-of-react-redux-connected-components-eda058b6727d

import ApplicationState from "../ApplicationState";
import {connect} from "react-redux";
import {GherkinDocument, GherkinDocumentProps} from "./GherkinDocument";
import {io} from "cucumber-messages";
import * as React from "react";

interface OwnProps {
}

type StateProps = GherkinDocumentProps

interface DispatchProps {
}

//type Props = StateProps & DispatchProps & OwnProps

type State = ApplicationState

function mapStateToProps(state: State, ownProps: OwnProps): StateProps {
    return {
        gherkinDocument: state.gherkinDocuments.get(state.gherkinDocumentUri)
    }
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps)(GherkinDocument)


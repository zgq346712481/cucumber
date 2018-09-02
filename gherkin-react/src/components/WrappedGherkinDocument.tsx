// https://medium.com/knerd/typescript-tips-series-proper-typing-of-react-redux-connected-components-eda058b6727d

import ApplicationState from "../ApplicationState";
import {connect} from "react-redux";
import {GherkinDocument} from "./GherkinDocument";
import {io} from "cucumber-messages";
import * as React from "react";
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;

interface OwnProps {
}

interface StateProps {
    gherkinDocument?: IGherkinDocument
}

interface DispatchProps {
}

type Props = StateProps & DispatchProps & OwnProps

type State = ApplicationState

function mapStateToProps(state: State, ownProps: OwnProps): StateProps {
    console.log("mapStateToProps")
    return {
        gherkinDocument: state.gherkinDocuments.get(state.gherkinDocumentUri)
    }
}

const Comp: React.SFC<Props> = (props: Props) => {
    if (!props.gherkinDocument) return <div>No gherkin doc</div>
    return <GherkinDocument gherkinDocument={props.gherkinDocument}/>;
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps)(Comp)


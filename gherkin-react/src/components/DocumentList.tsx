import * as React from "react";
import styled from 'styled-components';
import {io} from "cucumber-messages";
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;
import IFeature = io.cucumber.messages.IFeature;
import IRule = io.cucumber.messages.IRule;
import IBackground = io.cucumber.messages.IBackground;
import IExamples = io.cucumber.messages.IExamples;
import IScenario = io.cucumber.messages.IScenario;
import IStep = io.cucumber.messages.IStep;
import IDataTable = io.cucumber.messages.IDataTable;
import ITableRow = io.cucumber.messages.ITableRow;
import ITag = io.cucumber.messages.ITag;
import {GherkinDocument, GherkinDocumentProps} from "./GherkinDocument";
import ApplicationState from "../ApplicationState";
import {connect} from "react-redux";

const DocumentList: React.SFC<StateProps> = ({urls}) => {
    return <div>{urls.map(url => <p>{url}</p>)}</div>
}

interface OwnProps {
}

export interface StateProps {
    urls: string[]
}

interface DispatchProps {
}

//type Props = StateProps & DispatchProps & OwnProps

type State = ApplicationState

function mapStateToProps(state: State, ownProps: OwnProps): StateProps {
    let urls:string[] = []
    state.gherkinDocuments.forEach((_, url) => urls.push(url))
    return {
        urls: urls
    }
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps)(DocumentList)

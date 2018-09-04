import * as React from "react";
import {io} from "cucumber-messages";
import {connect} from "react-redux";
import styled from "styled-components";
import {AnyAction, Dispatch} from "redux";
import {ActionTypes} from "../actions";
import {Map} from "immutable";
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;
import ApplicationState from "../ApplicationState";

const DocumentLink = styled.a`
  color: white;
`

// interface State {
//     gherkinDocuments: Map<string, IGherkinDocument>
// }

export interface OwnProps {
}

export interface StateProps {
    urls: string[]
}

interface DispatchProps {
    showDocument: (url: string) => void
}

type Props = StateProps & DispatchProps & OwnProps

type State = ApplicationState

const DocumentList: React.SFC<Props> = ({urls, showDocument}) => {
    return <div>
        {urls.map(url => <p key={url}>
            <DocumentLink href="#" onClick={e => showDocument(url)}>{url}</DocumentLink>
        </p>)}
    </div>
}

function mapStateToProps(state: State, ownProps: OwnProps): StateProps {
    let urls: string[] = []
    state.gherkinDocuments.forEach((_, url) => urls.push(url))
    return {
        urls: urls
    }
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: OwnProps): DispatchProps {
    return {
        showDocument: (url) => dispatch({
            type: ActionTypes.SHOW_DOCUMENT,
            url
        })
    }
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(DocumentList)

import * as React from "react";
import {io} from "cucumber-messages";
import {connect} from "react-redux";
import styled from "styled-components";
import {Dispatch} from "redux";
import {ActionTypes} from "../actions";
import ApplicationState from "../ApplicationState";
import Badge from '@material-ui/core/Badge';
import {List, Map} from 'immutable'
import IPickle = io.cucumber.messages.IPickle;

const DocumentLink = styled.a`
  color: white;
`

// interface State {
//     gherkinDocuments: Map<string, IGherkinDocument>
// }

export interface OwnProps {
}

export interface StateProps {
    urls: string[],
    pickles: Map<string, List<IPickle>>
}

interface DispatchProps {
    showDocument: (url: string) => void
}

type Props = StateProps & DispatchProps & OwnProps

type State = ApplicationState

const DocumentList: React.SFC<Props> = ({urls, pickles, showDocument}) => {
    return <div>
        {urls.map(url => <p key={url}>
            <Badge badgeContent={pickles.has(url) ? pickles.get(url).size : "0"} color={"error"}>
                <DocumentLink href="#" onClick={e => showDocument(url)}>{url}</DocumentLink>
            </Badge>
        </p>)}
    </div>
}

function mapStateToProps(state: State, ownProps: OwnProps): StateProps {
    let urls: string[] = []
    state.gherkinDocuments.forEach((_, url) => urls.push(url))
    return {
        urls: urls,
        pickles: state.pickles
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

import * as React from "react"
import {io} from "cucumber-messages"
import {connect} from "react-redux"
import {Dispatch} from "redux"
import {ActionTypes} from "../actions"
import IApplicationState from "../IApplicationState"
import {ListItem, ListItemText} from "@material-ui/core"
import * as Immutable from "immutable"
import List from '@material-ui/core/List';
import IPickle = io.cucumber.messages.IPickle;
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;

// interface IState {
//     gherkinDocuments: Map<string, IGherkinDocument>
// }

// export interface IOwnProps {}
type IOwnProps = any

export interface IStateProps {
    gherkinDocuments: IGherkinDocument[],
    urls: string[]
    pickles: Immutable.Map<string, Immutable.List<IPickle>>
}

interface IDispatchProps {
    showDocument: (url: string) => void
}

// type Props = IStateProps & IDispatchProps & IOwnProps
interface IProps extends IStateProps, IDispatchProps, IOwnProps {
}

type State = IApplicationState

const DocumentList: React.SFC<IProps> = ({gherkinDocuments, pickles, showDocument}) => {
    return (
        <List>
            {gherkinDocuments.map(gherkinDocument => (
                <ListItem key={gherkinDocument.uri} button={true}>
                    <ListItemText onClick={e => showDocument(gherkinDocument.uri)}>{gherkinDocument.feature.name}</ListItemText>
                </ListItem>
            ))}
        </List>
    )
}

function mapStateToProps(state: State, ownProps: IOwnProps): IStateProps {
    const urls: string[] = []
    const gherkinDocuments: IGherkinDocument[] = []
    state.gherkinDocuments.forEach((gherkinDocument, url) => {
        if(url) {
            urls.push(url)
        }
        if(gherkinDocument) {
            gherkinDocuments.push(gherkinDocument)
        }
    })
    return {
        gherkinDocuments,
        urls,
        pickles: state.pickles
    }
}

function mapDispatchToProps(
    dispatch: Dispatch,
    ownProps: IOwnProps
): IDispatchProps {
    return {
        showDocument: url =>
            dispatch({
                type: ActionTypes.SHOW_DOCUMENT,
                url
            })
    }
}

export default connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps
)(DocumentList)

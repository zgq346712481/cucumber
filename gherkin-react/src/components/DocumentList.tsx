import * as React from "react"
import {io} from "cucumber-messages"
import {connect} from "react-redux"
import {Dispatch} from "redux"
import {ActionTypes} from "../actions"
import IApplicationState from "../IApplicationState"
import {ListItem} from "@material-ui/core"
import * as Immutable from "immutable"
import List from '@material-ui/core/List';
import IPickle = io.cucumber.messages.IPickle;

// interface IState {
//     gherkinDocuments: Map<string, IGherkinDocument>
// }

// export interface IOwnProps {}
type IOwnProps = any

export interface IStateProps {
  urls: string[]
  pickles: Immutable.Map<string, Immutable.List<IPickle>>
}

interface IDispatchProps {
  showDocument: (url: string) => void
}

// type Props = IStateProps & IDispatchProps & IOwnProps
interface IProps extends IStateProps, IDispatchProps, IOwnProps {}

type State = IApplicationState

const DocumentList: React.SFC<IProps> = ({ urls, pickles, showDocument }) => {
  return (
    <List>
      {urls.map(url => (
        <ListItem key={url} button={true}>
            <a href="#" onClick={e => showDocument(url)}>
                {url}
            </a>
        </ListItem>
      ))}
    </List>
  )
}

function mapStateToProps(state: State, ownProps: IOwnProps): IStateProps {
  const urls: string[] = []
  state.gherkinDocuments.forEach((_, url) => url ? urls.push(url) : null)
  return {
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

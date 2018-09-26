import * as React from "react"
import { io } from "cucumber-messages"
import { connect } from "react-redux"
import styled from "styled-components"
import { Dispatch } from "redux"
import { ActionTypes } from "../actions"
import IApplicationState from "../IApplicationState"
import { Badge } from "@material-ui/core"
import { List, Map } from "immutable"
import IPickle = io.cucumber.messages.IPickle

const DocumentLink = styled.a`
  color: white;
`

// interface IState {
//     gherkinDocuments: Map<string, IGherkinDocument>
// }

// export interface IOwnProps {}
type IOwnProps = any

export interface IStateProps {
  urls: string[]
  pickles: Map<string, List<IPickle>>
}

interface IDispatchProps {
  showDocument: (url: string) => void
}

// type Props = IStateProps & IDispatchProps & IOwnProps
interface IProps extends IStateProps, IDispatchProps, IOwnProps {}

type State = IApplicationState

const DocumentList: React.SFC<IProps> = ({ urls, pickles, showDocument }) => {
  return (
    <div>
      {urls.map(url => (
        <p key={url}>
          <Badge
            badgeContent={pickles.has(url) ? pickles.get(url).size : "0"}
            color={"error"}
          >
            <DocumentLink href="#" onClick={e => showDocument(url)}>
              {url}
            </DocumentLink>
          </Badge>
        </p>
      ))}
    </div>
  )
}

function mapStateToProps(state: State, ownProps: IOwnProps): IStateProps {
  const urls: string[] = []
  state.gherkinDocuments.forEach((_, url) => urls.push(url))
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

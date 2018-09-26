// https://medium.com/knerd/typescript-tips-series-proper-typing-of-react-redux-connected-components-eda058b6727d

import IApplicationState from "../IApplicationState"
import { connect } from "react-redux"
import { GherkinDocument, IGherkinDocumentProps } from "./GherkinDocument"
import { io } from "cucumber-messages"
import * as React from "react"

// interface IOwnProps {}
type IOwnProps = any

type IStateProps = IGherkinDocumentProps

// interface IDispatchProps {}
type IDispatchProps = any

// type Props = IStateProps & IDispatchProps & IOwnProps

type IState = IApplicationState

function mapStateToProps(state: IState, ownProps: IOwnProps): IStateProps {
  return {
    gherkinDocument: state.gherkinDocuments.get(state.gherkinDocumentUri)
  }
}

export default connect<IStateProps, IDispatchProps, IOwnProps>(mapStateToProps)(
  GherkinDocument
)

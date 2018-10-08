import * as React from 'react'
import {DragDropContext, DropResult} from 'react-beautiful-dnd'
import {io} from "cucumber-messages"
import RuleColumn from "./RuleColumn"
import Grid from "@material-ui/core/Grid/Grid"
import IRule = io.cucumber.messages.IRule

interface IExampleMapProps {
  rules: IRule[]
}

interface IExampleMapState {
  rules: IRule[]
}

export default class ExampleMap extends React.Component<IExampleMapProps, IExampleMapState> {

  constructor(props: IExampleMapProps) {
    super(props)

    this.state = {
      rules: this.props.rules,
    }
  }

  private onDragEnd = (result: DropResult) => {
    // no-op
  }

  public render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Grid container spacing={0}>
          {this.state.rules.map((rule: IRule) => {
            return <Grid item xs={3}>
              <RuleColumn key={rule.name!} rule={rule}/>
            </Grid>
          })}
        </Grid>
      </DragDropContext>
    )
  }

}

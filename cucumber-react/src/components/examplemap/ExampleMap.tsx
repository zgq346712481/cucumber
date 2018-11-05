import * as React from 'react'
// @ts-ignore
import * as Automerge from 'automerge'
import {DragDropContext, DropResult} from 'react-beautiful-dnd'
import RuleColumn from "./RuleColumn"
import {
  IExampleMap,
  IExampleMapRule,
  moveExampleToOtherRule,
  moveExampleWithinSameRule
} from "../../examplemap/ExampleMap"

interface IExampleMapProps {
  exampleMap: IExampleMap
}

interface IExampleMapState {
  exampleMap: IExampleMap
}

export default class ExampleMap extends React.Component<IExampleMapProps, IExampleMapState> {

  constructor(props: IExampleMapProps) {
    super(props)

    this.state = {
      exampleMap: this.props.exampleMap,
    }
  }

  private onDragEnd = (result: DropResult) => {
    const {destination, source} = result
    if (!destination) {
      // Dropped outside droppable
      return
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      // Dropped in original location
      return
    }

    if (destination.droppableId === source.droppableId) {
      const newExampleMap = Automerge.change(this.state.exampleMap, 'Move Example', (exampleMap: IExampleMap) => {
        moveExampleWithinSameRule(exampleMap, source.droppableId, source.index, destination.index)
      })

      this.setState({
        exampleMap: newExampleMap
      })
    } else {
      const newExampleMap = Automerge.change(this.state.exampleMap, 'Move Example', (exampleMap: IExampleMap) => {
        moveExampleToOtherRule(exampleMap, source.droppableId, destination.droppableId, source.index, destination.index)
      })

      this.setState({
        exampleMap: newExampleMap
      })
    }
  }

  public render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {this.state.exampleMap.ruleIds.map((ruleId: string) => {
          const rule = this.state.exampleMap.rules[ruleId] as IExampleMapRule
          return <RuleColumn key={rule.id} rule={rule} examples={this.state.exampleMap.examples}/>
        })}
      </DragDropContext>
    )
  }

}

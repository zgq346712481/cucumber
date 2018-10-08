import * as React from "react"
import {io} from "cucumber-messages"
import ExampleCard from "./ExampleCard"
import {Droppable} from 'react-beautiful-dnd'
import RuleCard from "./RuleCard"
import IRule = io.cucumber.messages.IRule
import IRuleChild = io.cucumber.messages.IRuleChild

interface IRuleColumnProps {
  rule: IRule
}

const RuleColumn: React.SFC<IRuleColumnProps> = ({rule}) => {
  return (
    <div>
      <RuleCard rule={rule}/>

      <Droppable droppableId={rule.name!}>
        {(provided) => <div
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {rule.children!.map((child: IRuleChild, index: number) => {
            if (!child.scenario) {
              return null
            }
            return <ExampleCard scenario={child.scenario} index={index}/>
          })}
          {provided.placeholder}
        </div>}
      </Droppable>
    </div>
  )
}

export default RuleColumn

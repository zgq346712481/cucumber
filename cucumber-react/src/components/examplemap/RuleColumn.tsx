import * as React from "react"
import {io} from "cucumber-messages"
import ExampleCard from "./ExampleCard"
import {Droppable} from 'react-beautiful-dnd'
import styled from "styled-components"
import IRule = io.cucumber.messages.IRule
import IRuleChild = io.cucumber.messages.IRuleChild

const Container = styled.div`
  padding: 0;
  margin: 8px;
  border: 1px solid lightgray;
  border-radius: 2px;
`

const Title = styled.div`
  margin: 0;
  padding: 8px;
`

const ExampleList = styled.div`
  margin: 0;
  padding: 8px;
`

interface IProps {
  rule: IRule
}

const RuleColumn: React.SFC<IProps> = ({rule}) => {
  return (
    <Container>
      <Title>{rule.name}</Title>

      <Droppable droppableId={rule.name!}>
        {(provided) => <ExampleList
          innerRef={provided.innerRef}
          {...provided.droppableProps}
        >
          {rule.children!.map((child: IRuleChild, index: number) => {
            if (!child.scenario) {
              return null
            }
            return <ExampleCard scenario={child.scenario} index={index}/>
          })}
          {provided.placeholder}
        </ExampleList>}
      </Droppable>
    </Container>
  )
}

export default RuleColumn

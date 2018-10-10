import * as React from "react"
import {io} from "cucumber-messages"
import {Draggable} from 'react-beautiful-dnd'
import styled from "styled-components"
import IScenario = io.cucumber.messages.IScenario

const Container = styled.div`
  border: 1px solid lightgray;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  margin-top: 0;
`

interface IProps {
  scenario: IScenario,
  index: number,
}

const ExampleCard: React.SFC<IProps> = ({scenario, index}) => {
  return (
    <Draggable draggableId={scenario.name!} index={index}>
      {(provided) => <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
      >
        <Container>{scenario.name}</Container>
      </div>
      }
    </Draggable>
  )
}
export default ExampleCard

import * as React from "react"
import {Draggable} from 'react-beautiful-dnd'
import styled from "styled-components"
import {IExampleMapExample} from "../../examplemap/ExampleMap"

const Container = styled.div`
  border: 1px solid lightgray;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  margin-top: 0;
`

interface IProps {
  example: IExampleMapExample,
  index: number,
}

const ExampleCard: React.SFC<IProps> = ({example, index}) => {
  return (
    <Draggable draggableId={example.id} index={index}>
      {(provided) => <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
      >
        <Container>{example.text}</Container>
      </div>
      }
    </Draggable>
  )
}
export default ExampleCard

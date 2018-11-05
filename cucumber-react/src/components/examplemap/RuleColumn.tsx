import * as React from "react"
import ExampleCard from "./ExampleCard"
import {Droppable} from 'react-beautiful-dnd'
import styled from "styled-components"
import {IExampleMapExample, IExampleMapRule} from '../../examplemap/ExampleMap'

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
  rule: IExampleMapRule,
  examples: { [id: string]: IExampleMapExample; }
}

const RuleColumn: React.SFC<IProps> = ({rule, examples}) => {
  return (
    <Container>
      <Title>{rule.text}</Title>

      <Droppable droppableId={rule.id}>
        {(provided) => <ExampleList
          innerRef={provided.innerRef}
          {...provided.droppableProps}
        >
          {rule.exampleIds.map((exampleId: string, index: number) => {
            const example = examples[exampleId]
            return <ExampleCard key={exampleId} example={example} index={index}/>
          })}
          {provided.placeholder}
        </ExampleList>}
      </Droppable>
    </Container>
  )
}

export default RuleColumn

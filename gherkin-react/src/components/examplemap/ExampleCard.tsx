import * as React from "react"
import {Typography} from "@material-ui/core"
import {io} from "cucumber-messages"
import Card from "@material-ui/core/Card/Card"
import CardContent from "@material-ui/core/CardContent/CardContent"
import {Draggable} from 'react-beautiful-dnd'
import IScenario = io.cucumber.messages.IScenario

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
        <Card style={{margin: "8px"}}>
          <CardContent>
            <Typography>
              {scenario.name}
            </Typography>
          </CardContent>
        </Card>
      </div>
      }
    </Draggable>
  )
}
export default ExampleCard

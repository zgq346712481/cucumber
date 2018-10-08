import * as React from "react"
import {Typography} from "@material-ui/core"
import {io} from "cucumber-messages"
import Card from "@material-ui/core/Card/Card"
import CardContent from "@material-ui/core/CardContent/CardContent"
import IRule = io.cucumber.messages.IRule

interface IProps {
  rule: IRule
}

const RuleCard: React.SFC<IProps> = ({rule}) => {
  return (
    <div>
      <Card style={{margin: "8px"}}>
        <CardContent>
          <Typography>
            {rule.name}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}
export default RuleCard

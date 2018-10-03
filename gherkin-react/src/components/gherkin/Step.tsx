import * as React from "react"
import DataTable from "./DataTable"
import {io} from "cucumber-messages"
import Keyword from "./Keyword"
import DocString from "./DocString"
import {StandardProps, Theme, Typography, withStyles} from "@material-ui/core"
import IStep = io.cucumber.messages.IStep
import ITestResult = io.cucumber.messages.ITestResult
import Status = io.cucumber.messages.Status
import {red, green} from "@material-ui/core/colors"

interface IStepProps extends StandardProps<React.HTMLAttributes<HTMLLIElement>, StepClassKey> {
  step: IStep
  result?: ITestResult
}

type StepClassKey = 'passed' | 'failed';


const Step: React.SFC<IStepProps> = ({classes, step, result}) => {
  const status = result ? Status[result.status!].toString().toLowerCase() : undefined
  const className = classes && status && classes[status]
  return (
    <li className={className}>
      <Typography>
        <Keyword>{step.keyword}</Keyword><span>{step.text}</span>
      </Typography>
      <DataTable dataTable={step.dataTable}/>
      <DocString docString={step.docString}/>
    </li>
  )
}

export default withStyles((theme: Theme) => ({
  failed: {
    backgroundColor: red["100"],
  },
  passed: {
    backgroundColor: green["100"],
  },
}), {withTheme: true})(Step)


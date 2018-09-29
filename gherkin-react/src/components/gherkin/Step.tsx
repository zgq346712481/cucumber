import * as React from "react";
import DataTable from "./DataTable";
import {io} from "cucumber-messages";
import Keyword from "./Keyword";
import IStep = io.cucumber.messages.IStep;

interface IStepProps {
    step: IStep
}

const Step: React.SFC<IStepProps> = ({step}) => {
    return (
        <li>
            <Keyword>{step.keyword}</Keyword><span>{step.text}</span>
            {step.dataTable ? <DataTable dataTable={step.dataTable}/> : null}
        </li>
    )
}

export default Step

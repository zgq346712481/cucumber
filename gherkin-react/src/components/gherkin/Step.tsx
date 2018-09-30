import * as React from "react";
import DataTable from "./DataTable";
import {io} from "cucumber-messages";
import Keyword from "./Keyword";
import IStep = io.cucumber.messages.IStep;
import {Typography} from "@material-ui/core";

interface IStepProps {
    step: IStep
}

const Step: React.SFC<IStepProps> = ({step}) => {
    return (
        <li>
            <Typography>
                <Keyword>{step.keyword}</Keyword><span>{step.text}</span>
            </Typography>
            {step.dataTable ? <DataTable dataTable={step.dataTable}/> : null}
        </li>
    )
}

export default Step

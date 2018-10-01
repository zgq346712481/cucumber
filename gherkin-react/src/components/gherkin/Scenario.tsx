import * as React from "react";
import Tags from "./Tags";
import {Typography} from "@material-ui/core";
import Keyword from "./Keyword";
import Description from "./Description";
import Step from "./Step";
import Examples from "./Examples";
import {io} from "cucumber-messages";
import StepList from "./StepList";
import IScenario = io.cucumber.messages.IScenario;

interface IScenarioProps {
    scenario: IScenario
}

const Scenario: React.SFC<IScenarioProps> = ({scenario}) => {
    return (
        <section>
            <Tags tags={scenario.tags}/>
            <Typography variant={"title"}>
                <Keyword>{scenario.keyword}</Keyword>: <span>{scenario.name}</span>
            </Typography>
            <Description description={scenario.description}/>
            <StepList>
                {(scenario.steps || []).map((step, index) => (
                    <Step key={index} step={step}/>
                ))}
            </StepList>

            {(scenario.examples || []).map((examples, index) => (
                <Examples key={index} examples={examples}/>
            ))}
        </section>
    )
}

export default Scenario

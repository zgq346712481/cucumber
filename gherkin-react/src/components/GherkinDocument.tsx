import * as React from "react";
import {io} from "cucumber-messages";
import styled from 'styled-components';
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;
import IFeature = io.cucumber.messages.IFeature;
import IScenario = io.cucumber.messages.IScenario;
import IStep = io.cucumber.messages.IStep;

const Keyword = styled.span`
    color: green;
`

const Name = styled.span`
    color: blue;
`

const StepText = styled.span`
    color: lightblue;
`

const StepList = styled.ol`
    list-style-type: none;
`

export interface GherkinProps {
    gherkinDocument: IGherkinDocument
}

export const GherkinDocument = ({gherkinDocument}: GherkinProps) => {
    if (!gherkinDocument.feature) {
        return <div>No feature</div>
    }
    return <Feature feature={gherkinDocument.feature}/>
};

interface FeatureProps {
    feature: IFeature
}

const Feature = ({feature}: FeatureProps) => {
    return <div>
        <h2 className="feature"><Keyword>{feature.keyword}</Keyword>: <Name>{feature.name}</Name></h2>
        {feature.children.map((child, index) => {
            if (child.scenario) {
                return <Scenario key={`scenario-${index}`} scenario={child.scenario}/>
            }
        })}
    </div>
};

interface ScenarioProps {
    scenario: IScenario
}

const Scenario = ({scenario}: ScenarioProps) => {
    return <div>
        <h3 className="scenario"><Keyword>{scenario.keyword}</Keyword>: <Name>{scenario.name}</Name></h3>
        <StepList>
            {scenario.steps.map((step, index) => <Step key={`step-${index}`} step={step}/>)}
        </StepList>
    </div>
};

interface StepProps {
    step: IStep
}

const Step = ({step}: StepProps) => {
    return <li><Keyword>{step.keyword}</Keyword><StepText>{step.text}</StepText></li>
};

import * as React from "react";
import {io} from "cucumber-messages";
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;
import IFeature = io.cucumber.messages.IFeature;
import IScenario = io.cucumber.messages.IScenario;
import styled from 'styled-components';

const Keyword = styled.span`
    color: green;
`

const Name = styled.span`
    color: blue;
`


export interface GherkinProps {
    gherkinDocument: IGherkinDocument
}

export const GherkinDocument = ({gherkinDocument}: GherkinProps) => {
    if(!gherkinDocument.feature) {
        return <div>No feature</div>
    }
    return <Feature feature={gherkinDocument.feature} />
};

interface FeatureProps {
    feature: IFeature
}

const Feature = ({feature}: FeatureProps) => {
    return <div>
        <h2 className="feature"><Keyword>{feature.keyword}</Keyword>: <Name>{feature.name}</Name></h2>
        {feature.children.map((child) => {
            if (child.scenario) {
                return <Scenario scenario={child.scenario} />
            }
        })}
    </div>
};

interface ScenarioProps {
    scenario: IScenario
}

const Scenario = ({scenario}: ScenarioProps) => {
    return <div>
        <h2 className="feature"><span className="keyword">{scenario.keyword}: </span><span className="name">{scenario.name}</span></h2>
        <ol>
            {scenario.steps.map((step) => {
                return <li><span className="keyword">{step.keyword}</span><span className="text">{step.text}</span></li>
            })}
        </ol>
    </div>
};


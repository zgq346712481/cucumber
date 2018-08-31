import * as React from "react";
import {io} from "cucumber-messages";
import styled from 'styled-components';
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;
import IFeature = io.cucumber.messages.IFeature;
import IRule = io.cucumber.messages.IRule;
import IBackground = io.cucumber.messages.IBackground;
import IExamples = io.cucumber.messages.IExamples;
import IScenario = io.cucumber.messages.IScenario;
import IStep = io.cucumber.messages.IStep;
import IDataTable = io.cucumber.messages.IDataTable;
import ITableRow = io.cucumber.messages.ITableRow;
import ITag = io.cucumber.messages.ITag;

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

const TagList = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
`

const Tag = styled.li`
    float: left;
    display: block;
    color: red;
    text-align: center;
    padding: 2px;
    text-decoration: none;
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
        <Tags tags={feature.tags}/>
        <h2><Keyword>{feature.keyword}</Keyword>: <Name>{feature.name}</Name></h2>
        {feature.children.map((child, index) => {
            if (child.background) {
                return <Background key={index} background={child.background}/>
            } else if (child.scenario) {
                return <Scenario key={index} scenario={child.scenario}/>
            } else if (child.rule) {
                return <Rule key={index} rule={child.rule}/>
            }
        })}
    </div>
};

interface RuleProps {
    rule: IRule
}

const Rule = ({rule}: RuleProps) => {
    return <div>
        <h3><Keyword>{rule.keyword}</Keyword>: <Name>{rule.name}</Name></h3>
        {rule.children.map((child, index) => {
            if (child.background) {
                return <Background key={index} background={child.background}/>
            } else if (child.scenario) {
                return <Scenario key={index} scenario={child.scenario}/>
            }
        })}
    </div>
};

interface BackgroundProps {
    background: IBackground
}

const Background = ({background}: BackgroundProps) => {
    return <div>
        <h3><Keyword>{background.keyword}</Keyword>: <Name>{background.name}</Name></h3>
        <StepList>
            {background.steps.map((step, index) => <Step key={index} step={step}/>)}
        </StepList>
    </div>
};

interface TagProps {
    tags: ITag[]
}

const Tags = ({tags}: TagProps) => {
    return <TagList>
        {tags.map((tag, index) => <Tag key={index}>{tag.name}</Tag>)}
    </TagList>
};

interface ScenarioProps {
    scenario: IScenario
}

const Scenario = ({scenario}: ScenarioProps) => {
    return <div>
        <Tags tags={scenario.tags}/>
        <h3><Keyword>{scenario.keyword}</Keyword>: <Name>{scenario.name}</Name></h3>
        <StepList>
            {scenario.steps.map((step, index) => <Step key={index} step={step}/>)}
        </StepList>

        {scenario.examples.map((examples, index) => <Examples key={index} examples={examples}/>)}
    </div>
};

interface ExamplesProps {
    examples: IExamples
}

const Examples = ({examples}: ExamplesProps) => {
    return <div>
        <Tags tags={examples.tags}/>
        <h3><Keyword>{examples.keyword}</Keyword>: <Name>{examples.name}</Name></h3>
        <ExamplesTable tableHeader={examples.tableHeader} tableBody={examples.tableBody}/>
    </div>
};

interface StepProps {
    step: IStep
}

const Step = ({step}: StepProps) => {
    return <li>
        <Keyword>{step.keyword}</Keyword><StepText>{step.text}</StepText>
        {step.dataTable ? <DataTable dataTable={step.dataTable}/> : null}
    </li>
};

interface ExamplesTableProps {
    tableHeader: ITableRow
    tableBody: ITableRow[]
}

const ExamplesTable = ({tableHeader, tableBody}: ExamplesTableProps) => {
    return <table>
        <thead>
        <tr>
            {tableHeader.cells.map((cell, j) => <th key={j}>{cell.value}</th>)}
        </tr>
        </thead>
        <tbody>
        {tableBody.map((row, i) => <tr key={i}>
            {row.cells.map((cell, j) => <td key={j}>{cell.value}</td>)}
        </tr>)}
        </tbody>
    </table>
};

interface DataTableProps {
    dataTable: IDataTable
}

const DataTable = ({dataTable}: DataTableProps) => {
    return <table>
        <tbody>
        {dataTable.rows.map((row, i) => <tr key={i}>
            {row.cells.map((cell, j) => <td key={j}>{cell.value}</td>)}
        </tr>)}
        </tbody>
    </table>
};
    
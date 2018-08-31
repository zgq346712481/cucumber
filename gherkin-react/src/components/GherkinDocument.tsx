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

const GherkinDocumentWrapper = styled.section`
    font-family: Arial;
    color: #113654;

    h1 { font-size: 24px;}
    h2 { font-size: 22px;}
    h3 { font-size: 18px;}
    h4 { font-size: 16px;}
    h5 { font-size: 12px;}
    h6 { font-size: 10px;}    
    section {
      padding-left: 12pt;
      
      h1, h2, h3 {
        padding: 0;
        margin-top: 4pt;
        margin-bottom: 2pt;
      }
    }
`

const DescriptionDiv = styled.div`
      padding-left: 12pt;
`

const Keyword = styled.span`
    font-weight: bold;
    color: #072a80;
`

const Name = styled.span`
    color: #0741c7;
`

const StepText = styled.span`
`

const StepList = styled.ol`
    list-style-type: none;
    padding-left: 0;
    margin-top: 2pt;

    li {
        margin-left: 12pt;
    }
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
    color: #0741c7;
    text-align: center;
    padding: 2px;
    text-decoration: none;
`

const TableTag = styled.table`
  border-collapse: collapse;
  margin-left: 12pt;
  margin-top: 2pt;
  
  th, td {
    border: 1px solid #ccc;
    
    pre {
      margin: 0;
      padding: 2pt;
    }
  }
`

export interface GherkinProps {
    gherkinDocument: IGherkinDocument
}

export const GherkinDocument = ({gherkinDocument}: GherkinProps) => {
    return <GherkinDocumentWrapper>
        {gherkinDocument.feature ? <Feature feature={gherkinDocument.feature}/> : <div>Empty Gherkin document :-(</div>}
    </GherkinDocumentWrapper>
};

interface FeatureProps {
    feature: IFeature
}

const Feature = ({feature}: FeatureProps) => {
    return <section>
        <Tags tags={feature.tags}/>
        <h1><Keyword>{feature.keyword}</Keyword>: <Name>{feature.name}</Name></h1>
        <Description description={feature.description}/>
        {feature.children.map((child, index) => {
            if (child.background) {
                return <Background key={index} background={child.background}/>
            } else if (child.scenario) {
                return <Scenario key={index} scenario={child.scenario}/>
            } else if (child.rule) {
                return <Rule key={index} rule={child.rule}/>
            }
        })}
    </section>
};

interface DescriptionProps {
    description: string
}

const Description = ({description}: DescriptionProps) => {
    return description ? <DescriptionDiv>{description}</DescriptionDiv> : null
}

interface RuleProps {
    rule: IRule
}

const Rule = ({rule}: RuleProps) => {
    return <section>
        <h2><Keyword>{rule.keyword}</Keyword>: <Name>{rule.name}</Name></h2>
        <Description description={rule.description}/>
        {rule.children.map((child, index) => {
            if (child.background) {
                return <Background key={index} background={child.background}/>
            } else if (child.scenario) {
                return <Scenario key={index} scenario={child.scenario}/>
            }
        })}
    </section>
};

interface BackgroundProps {
    background: IBackground
}

const Background = ({background}: BackgroundProps) => {
    return <section>
        <h2><Keyword>{background.keyword}</Keyword>: <Name>{background.name}</Name></h2>
        <Description description={background.description}/>
        <StepList>
            {background.steps.map((step, index) => <Step key={index} step={step}/>)}
        </StepList>
    </section>
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
    return <section>
        <Tags tags={scenario.tags}/>
        <h2><Keyword>{scenario.keyword}</Keyword>: <Name>{scenario.name}</Name></h2>
        <Description description={scenario.description}/>
        <StepList>
            {scenario.steps.map((step, index) => <Step key={index} step={step}/>)}
        </StepList>

        {scenario.examples.map((examples, index) => <Examples key={index} examples={examples}/>)}
    </section>
};

interface ExamplesProps {
    examples: IExamples
}

const Examples = ({examples}: ExamplesProps) => {
    return <section>
        <Tags tags={examples.tags}/>
        <h3><Keyword>{examples.keyword}</Keyword>: <Name>{examples.name}</Name></h3>
        <Description description={examples.description}/>
        <ExamplesTable tableHeader={examples.tableHeader} tableBody={examples.tableBody}/>
    </section>
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
    return <TableTag>
        <thead>
        <tr>
            {tableHeader.cells.map((cell, j) => <th key={j}>
                <pre>{cell.value}</pre>
            </th>)}
        </tr>
        </thead>
        <tbody>
        {tableBody.map((row, i) => <tr key={i}>
            {row.cells.map((cell, j) => <td key={j}>
                <pre>{cell.value}</pre>
            </td>)}
        </tr>)}
        </tbody>
    </TableTag>
};

interface DataTableProps {
    dataTable: IDataTable
}

const DataTable = ({dataTable}: DataTableProps) => {
    return <TableTag>
        <tbody>
        {dataTable.rows.map((row, i) => <tr key={i}>
            {row.cells.map((cell, j) => <td key={j}>
                <pre>{cell.value}</pre>
            </td>)}
        </tr>)}
        </tbody>
    </TableTag>
};
    
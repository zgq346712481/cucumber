import * as React from "react"
import styled from "styled-components"
import { io } from "cucumber-messages"
import { Table, TableBody,  TableHead, TableCell, TableRow, Typography } from "@material-ui/core"
import IGherkinDocument = io.cucumber.messages.IGherkinDocument
import IFeature = io.cucumber.messages.IFeature
import IRule = io.cucumber.messages.IRule
import IBackground = io.cucumber.messages.IBackground
import IExamples = io.cucumber.messages.IExamples
import IScenario = io.cucumber.messages.IScenario
import IStep = io.cucumber.messages.IStep
import IDataTable = io.cucumber.messages.IDataTable
import ITableRow = io.cucumber.messages.ITableRow
import ITag = io.cucumber.messages.ITag

const GherkinDocumentWrapper = styled.section`
  font-family: Arial;
  color: #113654;

  h1 {
    font-size: 24px;
  }
  h2 {
    font-size: 22px;
  }
  h3 {
    font-size: 18px;
  }
  h4 {
    font-size: 16px;
  }
  h5 {
    font-size: 12px;
  }
  h6 {
    font-size: 10px;
  }
  section {
    padding-left: 12pt;

    h1,
    h2,
    h3 {
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

const StepText = styled.span``

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

export interface IGherkinDocumentProps {
  gherkinDocument?: IGherkinDocument
}

export const GherkinDocument: React.SFC<IGherkinDocumentProps> = ({
  gherkinDocument
}) => {
  if (!gherkinDocument) { return <div>No gherkin doc</div> }
  return (
    <GherkinDocumentWrapper>
      {gherkinDocument.feature ? (
        <Feature feature={gherkinDocument.feature} />
      ) : (
        <div>Empty Gherkin document :-(</div>
      )}
    </GherkinDocumentWrapper>
  )
}

//// INTERNAL

interface IFeatureProps {
  feature: IFeature
}

const Feature: React.SFC<IFeatureProps> = ({ feature }) => {
  return (
    <section>
      <Tags tags={feature.tags} />
      <Typography variant={"headline"}>
        <Keyword>{feature.keyword}</Keyword>: <Name>{feature.name}</Name>
      </Typography>
      <Description description={feature.description} />
      {feature.children.map((child, index) => {
        if (child.background) {
          return <Background key={index} background={child.background} />
        } else if (child.scenario) {
          return <Scenario key={index} scenario={child.scenario} />
        } else if (child.rule) {
          return <Rule key={index} rule={child.rule} />
        }
      })}
    </section>
  )
}

interface IDescriptionProps {
  description: string
}

const Description: React.SFC<IDescriptionProps> = ({ description }) => {
  return description ? <DescriptionDiv>{description}</DescriptionDiv> : null
}

interface IRuleProps {
  rule: IRule
}

const Rule: React.SFC<IRuleProps> = ({ rule }) => {
  return (
    <section>
      <Typography variant={"title"}>
        <Keyword>{rule.keyword}</Keyword>: <Name>{rule.name}</Name>
      </Typography>
      <Description description={rule.description} />
      {rule.children.map((child, index) => {
        if (child.background) {
          return <Background key={index} background={child.background} />
        } else if (child.scenario) {
          return <Scenario key={index} scenario={child.scenario} />
        }
      })}
    </section>
  )
}

interface IBackgroundProps {
  background: IBackground
}

const Background: React.SFC<IBackgroundProps> = ({ background }) => {
  return (
    <section>
      <Typography variant={"title"}>
        <Keyword>{background.keyword}</Keyword>: <Name>{background.name}</Name>
      </Typography>
      <Description description={background.description} />
      <StepList>
        {background.steps.map((step, index) => (
          <Step key={index} step={step} />
        ))}
      </StepList>
    </section>
  )
}

interface ITagsProps {
  tags: ITag[]
}

const Tags: React.SFC<ITagsProps> = ({ tags }) => {
  return (
    <TagList>
      {tags.map((tag, index) => (
        <Tag key={index}>{tag.name}</Tag>
      ))}
    </TagList>
  )
}

interface IScenarioProps {
  scenario: IScenario
}

const Scenario: React.SFC<IScenarioProps> = ({ scenario }) => {
  return (
    <section>
      <Tags tags={scenario.tags} />
      <Typography variant={"title"}>
        <Keyword>{scenario.keyword}</Keyword>: <Name>{scenario.name}</Name>
      </Typography>
      <Description description={scenario.description} />
      <StepList>
        {scenario.steps.map((step, index) => (
          <Step key={index} step={step} />
        ))}
      </StepList>

      {scenario.examples.map((examples, index) => (
        <Examples key={index} examples={examples} />
      ))}
    </section>
  )
}

interface IExamplesProps {
  examples: IExamples
}

const Examples: React.SFC<IExamplesProps> = ({ examples }) => {
  return (
    <section>
      <Tags tags={examples.tags} />
      <Typography variant={"subheading"}>
        <Keyword>{examples.keyword}</Keyword>: <Name>{examples.name}</Name>
      </Typography>
      <Description description={examples.description} />
      <ExamplesTable
        tableHeader={examples.tableHeader}
        tableBody={examples.tableBody}
      />
    </section>
  )
}

interface IStepProps {
  step: IStep
}

const Step: React.SFC<IStepProps> = ({ step }) => {
  return (
    <li>
      <Keyword>{step.keyword}</Keyword>
      <StepText>{step.text}</StepText>
      {step.dataTable ? <DataTable dataTable={step.dataTable} /> : null}
    </li>
  )
}

interface IExamplesTableProps {
  tableHeader: ITableRow
  tableBody: ITableRow[]
}

const ExamplesTable: React.SFC<IExamplesTableProps> = ({
  tableHeader,
  tableBody
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {tableHeader.cells.map((cell, j) => (
            <TableCell key={j}>
              <pre>{cell.value}</pre>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableBody.map((row, i) => (
          <TableRow key={i}>
            {row.cells.map((cell, j) => (
              <TableCell key={j}>
                <pre>{cell.value}</pre>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

interface IDataTableProps {
  dataTable: IDataTable
}

const DataTable: React.SFC<IDataTableProps> = ({ dataTable }) => {
  return (
    <Table>
      <TableBody>
        {dataTable.rows.map((row, i) => (
          <TableRow key={i}>
            {row.cells.map((cell, j) => (
              <TableCell key={j}>
                <pre>{cell.value}</pre>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

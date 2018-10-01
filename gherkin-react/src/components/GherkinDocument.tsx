import * as React from "react"
import styled from "styled-components"
import {io} from "cucumber-messages"
import Feature from "./gherkin/Feature";
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;

const GherkinDocumentWrapper = styled.section`
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

export interface IGherkinDocumentProps {
    gherkinDocument?: IGherkinDocument | null
}

export const GherkinDocument: React.SFC<IGherkinDocumentProps> = ({gherkinDocument}) => {
    if (!gherkinDocument) {
        return <div>No gherkin doc</div>
    }
    return (
        <GherkinDocumentWrapper>
            {gherkinDocument.feature ? (
                <Feature feature={gherkinDocument.feature}/>
            ) : (
                <div>Empty Gherkin document :-(</div>
            )}
        </GherkinDocumentWrapper>
    )
}



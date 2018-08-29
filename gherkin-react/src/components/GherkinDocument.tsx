import * as React from "react";
import {io} from "cucumber-messages";
import IGherkinDocument = io.cucumber.messages.IGherkinDocument;

export interface GherkinProps {
    gherkinDocument: IGherkinDocument
}

export const GherkinDocument = ({gherkinDocument}: GherkinProps) => <h1>Hello from {gherkinDocument.feature.name}!</h1>;
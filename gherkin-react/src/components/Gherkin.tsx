import * as React from "react";
import {io} from "cucumber-messages";
import GherkinDocument = io.cucumber.messages.GherkinDocument;

export interface GherkinProps {
    gherkinDocument: GherkinDocument
}

export const Gherkin = ({gherkinDocument}: GherkinProps) => <h1>Hello from {gherkinDocument.feature.name}!</h1>;
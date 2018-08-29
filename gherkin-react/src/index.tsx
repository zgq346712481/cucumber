import * as React from "react";
import * as ReactDOM from "react-dom";

import { Gherkin } from "./components/Gherkin";
import {io} from "cucumber-messages";
const {GherkinDocument, Feature} = io.cucumber.messages;

const gherkinDocument = GherkinDocument.create({
    feature: Feature.create({
        name: "Hello"
    })
})

ReactDOM.render(
    <Gherkin gherkinDocument={gherkinDocument} />,
    document.getElementById("example")
);
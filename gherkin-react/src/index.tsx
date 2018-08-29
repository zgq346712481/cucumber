import * as React from "react";
import * as ReactDOM from "react-dom";

import {GherkinDocument} from "./components/GherkinDocument";
import {io} from "cucumber-messages";
import readWrapper from "./readWrapper";

const data = document.getElementById("messages").innerText;
const wrapper = readWrapper(data)

if(wrapper.gherkinDocument) {
    ReactDOM.render(
        <GherkinDocument gherkinDocument={wrapper.gherkinDocument}/>,
        document.getElementById("example")
    );    
}

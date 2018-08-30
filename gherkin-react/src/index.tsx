import * as React from "react";
import * as ReactDOM from "react-dom";

import {GherkinDocument} from "./components/GherkinDocument";
import {io} from "cucumber-messages";
import eachWrapper from "./eachWrapper";

const data = document.getElementById("messages").innerText;

eachWrapper(data,(wrapper) => {
    if(wrapper.gherkinDocument) {
        ReactDOM.render(
            <GherkinDocument gherkinDocument={wrapper.gherkinDocument}/>,
            document.getElementById("example")
        );
    }

    if(wrapper.pickle) {
        console.log("pickleId", wrapper.pickle.id)
    }

    if(wrapper.testCaseStarted) {
        const pickleId = wrapper.testCaseStarted.pickleId
        console.log('testCaseStarted', pickleId)
    }

    if(wrapper.testStepStarted) {
        const pickleId = wrapper.testStepStarted.pickleId
        const index = wrapper.testStepStarted.index
        console.log('testStepStarted', pickleId, index)
    }

    if(wrapper.testStepFinished) {
        const pickleId = wrapper.testStepFinished.pickleId
        const index = wrapper.testStepFinished.index
        const status = wrapper.testStepFinished.testResult.status
        const message = wrapper.testStepFinished.testResult.message
        console.log('testStepFinished', pickleId, index, status, message)
    }

    if(wrapper.testCaseFinished) {
        const pickleId = wrapper.testCaseFinished.pickleId
        console.log('testCaseFinished', pickleId)
    }
})

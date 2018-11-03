import Step from "./Step"
import {configure} from "enzyme"
import * as React from "react"
import * as Adapter from 'enzyme-adapter-react-16'
import {io} from "cucumber-messages"
import {createRender} from "@material-ui/core/test-utils";
import * as assert from "assert";
import IStep = io.cucumber.messages.IStep;
import ITestResult = io.cucumber.messages.ITestResult;
import Status = io.cucumber.messages.Status;

configure({adapter: new Adapter()})


describe("<Step />", () => {
    let render = createRender()

    beforeEach(() => {
        render = createRender()
    })

    it("renders without result", () => {
        const step: IStep = {
            keyword: "Given ",
            text: "I have 10 cukes"
        }
        const e = render(<Step step={step}/>)
        assert.deepStrictEqual(e.attr().class, undefined)
    })

    it("renders with results", () => {
        const step: IStep = {
            keyword: "Given ",
            text: "I have 10 cukes"
        }

        const result: ITestResult = {
            status: Status.FAILED,
        }
        const e = render(<Step step={step} result={result}/>)
        assert.deepStrictEqual(e.attr().class, "Step-failed-1")
    })
})

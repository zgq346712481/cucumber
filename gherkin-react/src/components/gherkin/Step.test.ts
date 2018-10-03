import Step from "./Step"
import {configure, shallow} from "enzyme"
import * as React from "react"
import * as Adapter from 'enzyme-adapter-react-16'
import {io} from "cucumber-messages"
import IStep = io.cucumber.messages.IStep
import ITestResult = io.cucumber.messages.ITestResult
import Status = io.cucumber.messages.Status

configure({adapter: new Adapter()})

describe("<Step />", () => {
  it("renders without result", () => {
    const step: IStep = {
      keyword: "Given ",
      text: "I have 10 cukes"
    }
    const e = shallow(React.createElement(Step, {step}, null))
    console.log(e.html())
  })

  it("renders without results", () => {
    const step: IStep = {
      keyword: "Given ",
      text: "I have 10 cukes"
    }

    const result: ITestResult = {
      status: Status.FAILED,
    }
    const e = shallow(React.createElement(Step, {step, result}, null))
    console.log(e.html())
  })
})

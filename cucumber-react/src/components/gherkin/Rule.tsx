import * as React from "react";
import {Typography} from "@material-ui/core";
import Keyword from "./Keyword";
import Description from "./Description";
import Scenario from "./Scenario";
import {io} from "cucumber-messages";
import Background from "./Background";
import IRule = io.cucumber.messages.IRule;

interface IRuleProps {
    rule: IRule
}

const Rule: React.SFC<IRuleProps> = ({rule}) => {
    return (
        <section>
            <Typography variant={"title"}>
                <Keyword>{rule.keyword}</Keyword>: <span>{rule.name}</span>
            </Typography>
            <Description description={rule.description}/>
            {(rule.children || []).map((child, index) => {
                if (child.background) {
                    return <Background key={index} background={child.background}/>
                } else if (child.scenario) {
                    return <Scenario key={index} scenario={child.scenario}/>
                } else {
                    throw new Error("Expected background or scenario")
                }
            })}
        </section>
    )
}

export default Rule

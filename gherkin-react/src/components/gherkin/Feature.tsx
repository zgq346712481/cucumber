import * as React from "react";
import Tags from "./Tags";
import {Typography} from "@material-ui/core";
import Keyword from "./Keyword";
import Description from "./Description";
import Scenario from "./Scenario";
import {io} from "cucumber-messages";
import IFeature = io.cucumber.messages.IFeature;
import Rule from "./Rule";
import Background from "./Background";

interface IFeatureProps {
    feature: IFeature
}

const Feature: React.SFC<IFeatureProps> = ({feature}) => {
    return (
        <section>
            <Tags tags={feature.tags}/>
            <Typography variant={"headline"}>
                <Keyword>{feature.keyword}</Keyword>: <span>{feature.name}</span>
            </Typography>
            <Description description={feature.description}/>
            {feature.children.map((child, index) => {
                if (child.background) {
                    return <Background key={index} background={child.background}/>
                } else if (child.scenario) {
                    return <Scenario key={index} scenario={child.scenario}/>
                } else if (child.rule) {
                    return <Rule key={index} rule={child.rule}/>
                } else {
                    throw new Error("Expected background, scenario or rule")
                }
            })}
        </section>
    )
}

export default Feature

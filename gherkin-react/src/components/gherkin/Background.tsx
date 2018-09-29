import * as React from "react";
import {Typography} from "@material-ui/core";
import Keyword from "./Keyword";
import Description from "./Description";
import StepList from "./StepList";
import Step from "./Step";
import {io} from "cucumber-messages";
import IBackground = io.cucumber.messages.IBackground;

interface IBackgroundProps {
    background: IBackground
}

const Background: React.SFC<IBackgroundProps> = ({background}) => {
    return (
        <section>
            <Typography variant={"title"}>
                <Keyword>{background.keyword}</Keyword>: <span>{background.name}</span>
            </Typography>
            <Description description={background.description}/>
            <StepList>
                {background.steps.map((step, index) => (
                    <Step key={index} step={step}/>
                ))}
            </StepList>
        </section>
    )
}

export default Background

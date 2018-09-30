import * as React from "react";
import styled from "styled-components";
import {Typography} from "@material-ui/core";

const DescriptionDiv = styled.div`
  padding-left: 12pt;
`

interface IDescriptionProps {
    description: string
}

const Description: React.SFC<IDescriptionProps> = ({description}) => {
    return description ? <DescriptionDiv><Typography>{description}</Typography></DescriptionDiv> : null
}

export default Description

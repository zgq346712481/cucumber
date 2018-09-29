import * as React from "react";
import styled from "styled-components";

const DescriptionDiv = styled.div`
  padding-left: 12pt;
`

interface IDescriptionProps {
    description: string
}

const Description: React.SFC<IDescriptionProps> = ({description}) => {
    return description ? <DescriptionDiv>{description}</DescriptionDiv> : null
}

export default Description

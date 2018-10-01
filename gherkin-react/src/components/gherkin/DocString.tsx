import * as React from "react";
import {io} from "cucumber-messages";
import IDocString = io.cucumber.messages.IDocString;

interface IDataTableProps {
    docString?: IDocString | null
}

const DocString: React.SFC<IDataTableProps> = ({docString}) => {
    if (!docString) { return null }
    return (
        <pre>{docString.content}</pre>
    )
}

export default DocString

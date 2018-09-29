import * as React from "react";
import {io} from "cucumber-messages";
import ITag = io.cucumber.messages.ITag;
import TagList from "./TagList";
import Tag from "./Tag";

interface ITagsProps {
    tags?: ITag[]
}

const Tags: React.SFC<ITagsProps> = ({tags}) => {
    return (
        <TagList>
            {(tags || []).map((tag, index) => (
                <Tag key={index}>{tag.name}</Tag>
            ))}
        </TagList>
    )
}

export default Tags

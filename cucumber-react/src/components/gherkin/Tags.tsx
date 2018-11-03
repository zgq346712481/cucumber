import * as React from "react";
import {io} from "cucumber-messages";
import TagList from "./TagList";
import Tag from "./Tag";
import ITag = io.cucumber.messages.ITag;

interface ITagsProps {
    tags?: ITag[] | null
}

const Tags: React.SFC<ITagsProps> = ({tags}) => {
    if (!tags) {
        return null
    }
    return (
        <TagList>
            {tags.map((tag, index) => (
                <Tag key={index}>{tag.name}</Tag>
            ))}
        </TagList>
    )
}

export default Tags

import { Readable } from "stream"
import { io } from "cucumber-messages"
import { ILoadMessagesAction } from "../actions"
import MemoryStream from "./MemoryStream"

export default function(action: ILoadMessagesAction): Readable {
  if (action.data) {
    return new MemoryStream(action.data)
  } else if (action.url) {
    throw new Error(
      `Can't load messages fromn url yet: ${JSON.stringify(action)}`
    )
  }
}

import {Readable} from "stream"
import * as gherkin from 'gherkin'
// @ts-ignore
import * as Automerge from 'automerge'
import {io} from "cucumber-messages"
import {buildExampleMap, IExampleMap} from '../../../src/examplemap/ExampleMap'
import assert = require("assert")
import Media = io.cucumber.messages.Media
import Wrapper = io.cucumber.messages.Wrapper
import IGherkinDocument = io.cucumber.messages.IGherkinDocument
import Source = io.cucumber.messages.Source

describe("buildExampleMap", () => {
  it("builds an ExampleMap from a Feature", async () => {
    const gherkinDocument = await parse(`Feature: F1
      Rule: R2
        Example: E3
        Example: E4
    `)

    const exampleMap = Automerge.change(Automerge.init(), 'Initialize Example Map', (doc: any) => {
      buildExampleMap(gherkinDocument.feature!, doc)
    })
    const expected: IExampleMap = {
      "examples": {
        "3": {
          "id": "3",
          "text": "E3"
        },
        "4": {
          "id": "4",
          "text": "E4",
        }
      },
      "rules": {
        "2": {
          "exampleIds": [
            "3",
            "4"
          ],
          "id": "2",
          "text": "R2"
        }
      },
      "ruleIds": ["2"]
    }
    assert.deepStrictEqual(exampleMap, expected)
  })
})

// TODO: Extract to Gherkin

async function parse(data: string): Promise<IGherkinDocument> {
  const source = Source.fromObject({
    uri: 'test.feature',
    data,
    media: Media.fromObject({
      encoding: 'UTF-8',
      contentType: 'text/x.cucumber.gherkin+plain',
    })
  })
  const wrappers = await streamToArray(gherkin.fromSources([source], {
    includeGherkinDocument: true,
    includeSource: false,
    includePickles: false
  }))
  return wrappers[0].gherkinDocument!
}

async function streamToArray(readableStream: Readable): Promise<Wrapper[]> {
  return new Promise<Wrapper[]>((resolve: (wrappers: Wrapper[]) => void, reject: (err: Error) => void) => {
    const items: Wrapper[] = []
    readableStream.on('data', items.push.bind(items))
    readableStream.on('error', (err: Error) => reject(err))
    readableStream.on('end', () => resolve(items))
  })
}

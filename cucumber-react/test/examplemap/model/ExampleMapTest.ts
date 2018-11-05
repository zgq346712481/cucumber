import {Readable} from "stream"
import * as gherkin from 'gherkin'
// @ts-ignore
import * as Automerge from 'automerge'
import {io} from "cucumber-messages"
import {
  buildExampleMap,
  createFeature,
  featureRules,
  IExampleMap,
  moveExample,
  ruleScenarios
} from '../../../src/examplemap/ExampleMap'
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
    const feature = gherkinDocument.feature!

    const exampleMap = Automerge.change(Automerge.init(), 'Initialize Example Map', (doc: IExampleMap) => {
      buildExampleMap(feature, doc)
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

describe("updateFeature", () => {
  describe("within the same rule", () => {
    it("moves an example", async () => {
      const gherkinDocument = await parse(`Feature: F1
      Rule: R2

        Example: E4
        Example: E5
    `)
      const feature = gherkinDocument.feature!
      const [r2] = featureRules(feature)
      const [e4, e5] = ruleScenarios(r2.rule!)

      const exampleMap = Automerge.change(Automerge.init(), 'Initialize Example Map', (doc: IExampleMap) => {
        buildExampleMap(feature, doc)
      })

      const newExampleMap = Automerge.change(exampleMap, 'Move card', (doc: IExampleMap) => {
        moveExample(doc, '2', '2', 0, 1)
      })

      const newFeature = createFeature(feature, newExampleMap)

      const [newR2] = featureRules(newFeature)
      const [newE5, newE4] = ruleScenarios(newR2.rule!)

      assert.deepStrictEqual(newE5, e5)
      assert.deepStrictEqual(newE4, e4)
    })

    it("adds an example")
    it("removes an example")
  })

  describe("within two rules", () => {
    it("moves an example", async () => {
      const gherkinDocument = await parse(`Feature: F1
      Rule: R2

        Example: E4
        Example: E5
      Rule: R6

        Example: E8
        Example: E9
    `)
      const feature = gherkinDocument.feature!
      const [r2, r6] = featureRules(feature)
      const [e4, e5] = ruleScenarios(r2.rule!)
      const [e8, e9] = ruleScenarios(r6.rule!)

      const exampleMap = Automerge.change(Automerge.init(), 'Initialize Example Map', (doc: IExampleMap) => {
        buildExampleMap(feature, doc)
      })

      const newExampleMap = Automerge.change(exampleMap, 'Move card', (doc: IExampleMap) => {
        moveExample(doc, '2', '6', 0, 1)
      })
      console.log(JSON.stringify(newExampleMap, null, 2))

      const newFeature = createFeature(feature, newExampleMap)

      const [newR2, newR6] = featureRules(newFeature)
      const [newE5] = ruleScenarios(newR2.rule!)
      const [newE8, newE4, newE9] = ruleScenarios(newR6.rule!)

      assert.deepStrictEqual(newE4, e4)
      assert.deepStrictEqual(newE5, e5)
      assert.deepStrictEqual(newE8, e8)
      assert.deepStrictEqual(newE9, e9)
    })

    it("adds an example")
    it("removes an example")
  })

  it("moves a rule")
  it("adds a rule")
  it("removes a rule")
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

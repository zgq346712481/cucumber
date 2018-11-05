import {io} from "cucumber-messages"
import IRule = io.cucumber.messages.IRule
import IRuleChild = io.cucumber.messages.IRuleChild
import IFeatureChild = io.cucumber.messages.IFeatureChild
import IFeature = io.cucumber.messages.IFeature
import Feature = io.cucumber.messages.Feature

export function featureRules(feature: IFeature): IFeatureChild[] {
  return feature.children!
    .filter((child: IFeatureChild) => child.rule)
}

export function ruleScenarios(rule: IRule): IRuleChild[] {
  return rule.children!
    .filter((child: IRuleChild) => child.scenario)
}

export interface IExampleMap {
  examples: { [id: string]: IExampleMapExample; }
  rules: { [id: string]: IExampleMapRule; }
  ruleIds: string[],
}

export interface IExampleMapRule {
  id: string,
  text: string,
  exampleIds: string[],
}

export interface IExampleMapExample {
  id: string,
  text: string,
}

export function buildExampleMap(feature: IFeature, exampleMap: IExampleMap) {
  const examples: { [id: string]: IExampleMapExample; } = {}
  const rules: { [id: string]: IExampleMapRule; } = {}
  const ruleIds: string[] = []

  featureRules(feature).forEach((featureChild) => {
    const exampleIds: string[] = []
    ruleScenarios(featureChild.rule!).forEach((ruleChild) => {
      const exampleId: string = String(ruleChild.scenario!.location!.line!)
      exampleIds.push(exampleId)
      examples[exampleId] = {
        id: exampleId,
        text: ruleChild.scenario!.name!
      }
    })
    const ruleId: string = String(featureChild.rule!.location!.line!)
    ruleIds.push(ruleId)
    rules[ruleId] = {
      id: ruleId,
      text: featureChild.rule!.name!,
      exampleIds
    }
  })

  exampleMap.ruleIds = ruleIds
  exampleMap.rules = rules
  exampleMap.examples = examples
  return exampleMap
}

/**
 * Creates a new feature from an original feature, and an example map
 *
 * @param feature the model of the feature to create
 * @param exampleMap an example map that indicates the new order of elements in the feature
 */
export function createFeature(feature: IFeature, exampleMap: IExampleMap): IFeature {
  // TODO: Make this function operate on an Automerge representation of a Feature,
  // Moving things around. That would allow *reordering* of feature content in the ExampleNap

  const newFeature = Feature.fromObject(feature)

  const featureChildrenRule = featureRules(feature)
  const allRuleChildrenScenario = []
  for (const featureChild of featureChildrenRule) {
    const ruleChildrenScenario = ruleScenarios(featureChild.rule!)
    allRuleChildrenScenario.push(...ruleChildrenScenario)
  }

  for (const exampleMapRuleId of exampleMap.ruleIds) {
    const exampleMapRule = exampleMap.rules[exampleMapRuleId]
    const ruleLine = Number(exampleMapRule.id)
    const featureChildRule = featureChildrenRule.find(c => c.rule!.location!.line === ruleLine)
    if (featureChildRule) {
      const rule = featureChildRule.rule!
      // Clear the current rule children, so we can populat them again
      // TODO: Keep Background
      rule.children = []
      for (const exampleMapExampleId of exampleMapRule.exampleIds) {
        const example = exampleMap.examples[exampleMapExampleId]
        const scenarioLine = Number(example.id)
        const ruleChildScenario = allRuleChildrenScenario.find(c => c.scenario!.location!.line === scenarioLine)
        if (ruleChildScenario) {
          rule.children!.push(ruleChildScenario)
        } else {
          console.log("TODO: Add a new Example to Rule")
        }
      }
    }
  }

  return newFeature
}

export function moveExampleWithinSameRule(exampleMap: IExampleMap, sourceRuleId: string, sourceIndex: number, destinationIndex: number) {
  const sourceRule: IExampleMapRule = exampleMap.rules[sourceRuleId]
  const [exampleId] = sourceRule.exampleIds.splice(sourceIndex, 1)
  sourceRule.exampleIds.splice(destinationIndex, 0, exampleId)
}

export function moveExampleToOtherRule(exampleMap: IExampleMap, sourceRuleId: string, destinationRuleId: string, sourceIndex: number, destinationIndex: number) {
  const sourceRule: IExampleMapRule = exampleMap.rules[sourceRuleId]
  const destinationRule: IExampleMapRule = exampleMap.rules[destinationRuleId]
  const [exampleId] = sourceRule.exampleIds.splice(sourceIndex, 1)
  destinationRule.exampleIds.splice(destinationIndex, 0, exampleId)
}

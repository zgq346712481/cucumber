import {io} from "cucumber-messages"
import IScenario = io.cucumber.messages.IScenario
import IRule = io.cucumber.messages.IRule
import IRuleChild = io.cucumber.messages.IRuleChild
import IFeatureChild = io.cucumber.messages.IFeatureChild
import IFeature = io.cucumber.messages.IFeature

export function featureRules(feature: IFeature): IRule[] {
  return feature.children!
    .filter((child: IFeatureChild) => child.rule)
    .map((child: IFeatureChild) => child.rule as IRule)
}

export function ruleScenarios(rule: IRule): IScenario[] {
  return rule.children!
    .filter((child: IRuleChild) => child.scenario)
    .map((child: IRuleChild) => child.scenario as IScenario)
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

  featureRules(feature).forEach((rule) => {
    const exampleIds: string[] = []
    ruleScenarios(rule).forEach((scenario) => {
      const exampleId: string = String(scenario.location!.line!)
      exampleIds.push(exampleId)
      examples[exampleId] = {
        id: exampleId,
        text: scenario.name!
      }
    })
    const ruleId: string = String(rule.location!.line!)
    ruleIds.push(ruleId)
    rules[ruleId] = {
      id: ruleId,
      text: rule.name!,
      exampleIds
    }
  })

  exampleMap.ruleIds = ruleIds
  exampleMap.rules = rules
  exampleMap.examples = examples
  return exampleMap
}

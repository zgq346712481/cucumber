import { messages } from '@cucumber/messages-light'

export interface IFilters {
  acceptScenario: (
    scenario: messages.GherkinDocument.Feature.IScenario
  ) => boolean
  acceptStep: (step: messages.GherkinDocument.Feature.IStep) => boolean
  acceptBackground: (
    background: messages.GherkinDocument.Feature.IBackground
  ) => boolean
  acceptRule: (
    rule: messages.GherkinDocument.Feature.FeatureChild.IRule
  ) => boolean
  acceptFeature: (feature: messages.GherkinDocument.IFeature) => boolean
}

export interface IHandlers {
  handleStep: (step: messages.GherkinDocument.Feature.IStep) => void
  handleScenario: (scenario: messages.GherkinDocument.Feature.IScenario) => void
  handleBackground: (
    background: messages.GherkinDocument.Feature.IBackground
  ) => void
  handleRule: (
    rule: messages.GherkinDocument.Feature.FeatureChild.IRule
  ) => void
  handleFeature: (feature: messages.GherkinDocument.IFeature) => void
}

const defaultFilters: IFilters = {
  acceptScenario: () => true,
  acceptStep: () => true,
  acceptBackground: () => true,
  acceptRule: () => true,
  acceptFeature: () => true,
}

export const rejectAllFilters: IFilters = {
  acceptScenario: () => false,
  acceptStep: () => false,
  acceptBackground: () => false,
  acceptRule: () => false,
  acceptFeature: () => false,
}

const defaultHandlers: IHandlers = {
  handleStep: () => null,
  handleScenario: () => null,
  handleBackground: () => null,
  handleRule: () => null,
  handleFeature: () => null,
}

export default class GherkinDocumentWalker {
  private readonly filters: IFilters
  private readonly handlers: IHandlers

  constructor(filters?: Partial<IFilters>, handlers?: Partial<IHandlers>) {
    this.filters = { ...defaultFilters, ...filters }
    this.handlers = { ...defaultHandlers, ...handlers }
  }

  public walkGherkinDocument(
    gherkinDocument: messages.IGherkinDocument
  ): messages.IGherkinDocument {
    if (!gherkinDocument.feature) {
      return {}
    }

    const feature = this.walkFeature(gherkinDocument.feature)

    if (!feature) {
      return {}
    }

    return {
      feature: feature,
      comments: gherkinDocument.comments,
      uri: gherkinDocument.uri,
    }
  }

  protected walkFeature(
    feature: messages.GherkinDocument.IFeature
  ): messages.GherkinDocument.IFeature {
    const keptChildren = this.walkFeatureChildren(feature.children || [])

    this.handlers.handleFeature(feature)

    const backgroundKept = keptChildren.find((child) => child.background)

    if (this.filters.acceptFeature(feature) || backgroundKept) {
      return this.copyFeature(
        feature,
        (feature.children || []).map((featureChild) => {
          if (featureChild.background) {
            return {
              background: this.copyBackground(featureChild.background),
            }
          }
          if (featureChild.scenario) {
            return {
              scenario: this.copyScenario(featureChild.scenario),
            }
          }
          if (featureChild.rule && featureChild.rule?.children) {
            return {
              rule: this.copyRule(
                featureChild.rule,
                featureChild.rule?.children
              ),
            }
          }
          return {}
        })
      )
    }

    if (keptChildren.find((child) => child !== null)) {
      return this.copyFeature(feature, keptChildren)
    }

    return {}
  }

  private copyFeature(
    feature: messages.GherkinDocument.IFeature,
    children: messages.GherkinDocument.Feature.IFeatureChild[]
  ): messages.GherkinDocument.IFeature {
    return {
      children: this.filterFeatureChildren(feature, children),
      location: feature.location,
      language: feature.language,
      keyword: feature.keyword,
      name: feature.name,
      description: feature.description ? feature.description : undefined,
      tags: this.copyTags(feature.tags),
    }
  }

  private copyTags(
    tags: messages.GherkinDocument.Feature.ITag[] | null | undefined
  ): messages.GherkinDocument.Feature.ITag[] | null | undefined {
    if (!tags) return tags
    return tags.map((tag) => ({
      name: tag.name,
      id: tag.id,
      location: tag.location,
    }))
  }

  private filterFeatureChildren(
    feature: messages.GherkinDocument.IFeature,
    children: messages.GherkinDocument.Feature.IFeatureChild[]
  ): messages.GherkinDocument.Feature.IFeatureChild[] {
    const copyChildren: messages.GherkinDocument.Feature.IFeatureChild[] = []

    const scenariosKeptById = new Map(
      children
        .filter((child) => child.scenario)
        .map((child) => [child.scenario?.id, child])
    )

    const ruleKeptById = new Map(
      children
        .filter((child) => child.rule)
        .map((child) => [child.rule?.id, child])
    )

    for (const featureChild of feature.children || []) {
      if (featureChild.background) {
        copyChildren.push({
          background: this.copyBackground(featureChild.background),
        })
      }

      if (featureChild.scenario) {
        const scenarioCopy = scenariosKeptById.get(featureChild.scenario.id)
        if (scenarioCopy) {
          copyChildren.push(scenarioCopy)
        }
      }

      if (featureChild.rule) {
        const ruleCopy = ruleKeptById.get(featureChild.rule.id)
        if (ruleCopy) {
          copyChildren.push(ruleCopy)
        }
      }
    }
    return copyChildren
  }

  private walkFeatureChildren(
    featureChildren: messages.GherkinDocument.Feature.IFeatureChild[]
  ): messages.GherkinDocument.Feature.IFeatureChild[] {
    const childrenCopy: messages.GherkinDocument.Feature.IFeatureChild[] = []

    for (const featureChild of featureChildren) {
      let backgroundCopy:
        | messages.GherkinDocument.Feature.IBackground
        | undefined = undefined
      let scenarioCopy:
        | messages.GherkinDocument.Feature.IScenario
        | undefined = undefined
      let ruleCopy:
        | messages.GherkinDocument.Feature.FeatureChild.IRule
        | undefined = undefined

      if (featureChild.background) {
        backgroundCopy = this.walkBackground(featureChild.background)
      }
      if (featureChild.scenario) {
        scenarioCopy = this.walkScenario(featureChild.scenario)
      }
      if (featureChild.rule) {
        ruleCopy = this.walkRule(featureChild.rule)
      }

      if (backgroundCopy || scenarioCopy || ruleCopy) {
        childrenCopy.push({
          background: backgroundCopy,
          scenario: scenarioCopy,
          rule: ruleCopy,
        })
      }
    }

    return childrenCopy
  }

  protected walkRule(
    rule: messages.GherkinDocument.Feature.FeatureChild.IRule
  ): messages.GherkinDocument.Feature.FeatureChild.IRule | undefined {
    const children = this.walkRuleChildren(rule.children || [])

    this.handlers.handleRule(rule)

    const backgroundKept = children.find((child) => child && child.background)
    const scenariosKept = children.filter((child) => child && child.scenario)

    if (this.filters.acceptRule(rule) || backgroundKept) {
      return this.copyRule(rule, rule.children || [])
    }
    if (scenariosKept.length > 0) {
      return this.copyRule(rule, scenariosKept)
    }
  }

  private copyRule(
    rule: messages.GherkinDocument.Feature.FeatureChild.IRule,
    children: messages.GherkinDocument.Feature.FeatureChild.IRuleChild[]
  ): messages.GherkinDocument.Feature.FeatureChild.IRule {
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description ? rule.description : undefined,
      location: rule.location,
      keyword: rule.keyword,
      children: this.filterRuleChildren(rule.children || [], children),
    }
  }

  private filterRuleChildren(
    children: messages.GherkinDocument.Feature.FeatureChild.IRuleChild[],
    childrenKept: messages.GherkinDocument.Feature.FeatureChild.IRuleChild[]
  ): messages.GherkinDocument.Feature.FeatureChild.IRuleChild[] {
    const childrenCopy: messages.GherkinDocument.Feature.FeatureChild.IRuleChild[] = []
    const scenariosKeptIds = childrenKept
      .filter((child) => child.scenario)
      .map((child) => child.scenario?.id)

    for (const child of children) {
      if (child.background) {
        childrenCopy.push({
          background: this.copyBackground(child.background),
        })
      }
      if (child.scenario && scenariosKeptIds.includes(child.scenario.id)) {
        childrenCopy.push({
          scenario: this.copyScenario(child.scenario),
        })
      }
    }

    return childrenCopy
  }

  private walkRuleChildren(
    children: messages.GherkinDocument.Feature.FeatureChild.IRuleChild[]
  ): messages.GherkinDocument.Feature.FeatureChild.IRuleChild[] {
    const childrenCopy: messages.GherkinDocument.Feature.FeatureChild.IRuleChild[] = []

    for (const child of children) {
      if (child.background) {
        childrenCopy.push({
          background: this.walkBackground(child.background),
        })
      }
      if (child.scenario) {
        childrenCopy.push({
          scenario: this.walkScenario(child.scenario),
        })
      }
    }
    return childrenCopy
  }

  protected walkBackground(
    background: messages.GherkinDocument.Feature.IBackground
  ): messages.GherkinDocument.Feature.IBackground | undefined {
    const steps = this.walkAllSteps(background.steps || [])
    this.handlers.handleBackground(background)

    if (
      this.filters.acceptBackground(background) ||
      steps.find((step) => step !== null)
    ) {
      return this.copyBackground(background)
    }
  }

  private copyBackground(
    background: messages.GherkinDocument.Feature.IBackground
  ): messages.GherkinDocument.Feature.IBackground {
    return {
      id: background.id,
      name: background.name,
      location: background.location,
      keyword: background.keyword,
      steps: (background.steps || []).map((step) => this.copyStep(step)),
      description: background.description ? background.description : undefined,
    }
  }

  protected walkScenario(
    scenario: messages.GherkinDocument.Feature.IScenario
  ): messages.GherkinDocument.Feature.IScenario | undefined {
    const steps = this.walkAllSteps(scenario.steps || [])
    this.handlers.handleScenario(scenario)

    if (
      this.filters.acceptScenario(scenario) ||
      steps.find((step) => step !== null)
    ) {
      return this.copyScenario(scenario)
    }
  }

  private copyScenario(
    scenario: messages.GherkinDocument.Feature.IScenario
  ): messages.GherkinDocument.Feature.IScenario {
    return {
      id: scenario.id,
      name: scenario.name,
      description: scenario.description ? scenario.description : undefined,
      location: scenario.location,
      keyword: scenario.keyword,
      examples: scenario.examples,
      steps: (scenario.steps || []).map((step) => this.copyStep(step)),
      tags: this.copyTags(scenario.tags),
    }
  }

  protected walkAllSteps(
    steps: messages.GherkinDocument.Feature.IStep[]
  ): messages.GherkinDocument.Feature.IStep[] {
    return steps.reduce((array, step) => {
      const walkedStep = this.walkStep(step)
      return walkedStep == null ? array : array.concat([walkedStep])
    }, [] as messages.GherkinDocument.Feature.IStep[])
  }

  protected walkStep(
    step: messages.GherkinDocument.Feature.IStep
  ): messages.GherkinDocument.Feature.IStep | null {
    this.handlers.handleStep(step)
    if (!this.filters.acceptStep(step)) {
      return null
    }
    return this.copyStep(step)
  }

  private copyStep(
    step: messages.GherkinDocument.Feature.IStep
  ): messages.GherkinDocument.Feature.IStep {
    if (!step) return step
    return {
      id: step.id,
      keyword: step.keyword,
      location: step.location,
      text: step.text,
      dataTable: step.dataTable,
      docString: step.docString,
    }
  }
}

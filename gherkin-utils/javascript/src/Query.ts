import { messages } from '@cucumber/messages-light'
import { ArrayMultimap } from '@teppeis/multimaps'

export default class Query {
  private readonly gherkinDocuments: messages.IGherkinDocument[] = []
  private readonly pickles: messages.IPickle[] = []
  private readonly locationByAstNodeId = new Map<string, messages.ILocation>()
  private readonly gherkinStepById = new Map<
    string,
    messages.GherkinDocument.Feature.IStep
  >()
  private readonly pickleIdsMapByUri = new Map<
    string,
    ArrayMultimap<string, string>
  >()

  private readonly pickleIdsByAstNodeId = new Map<string, string[]>()

  private readonly pickleStepIdsByAstNodeId = new Map<string, string[]>()

  /**
   * Gets the location (line and column) of an AST node.
   * @param astNodeId
   */
  public getLocation(astNodeId: string): messages.ILocation {
    if (!this.locationByAstNodeId.has(astNodeId))
      throw new Error(`No such astNodeId: ${astNodeId}`)

    return this.locationByAstNodeId.get(astNodeId)!
  }

  public getGherkinDocuments(): readonly messages.IGherkinDocument[] {
    return this.gherkinDocuments
  }

  public getPickles(): readonly messages.IPickle[] {
    return this.pickles
  }

  /**
   * Gets all the pickle IDs
   * @param uri - the URI of the document
   * @param astNodeId - optionally restrict results to a particular AST node
   */
  public getPickleIds(uri: string, astNodeId?: string): readonly string[] {
    if (!this.pickleIdsMapByUri.has(uri))
      throw new Error(`No pickleIds for uri: ${uri}`)
    const pickleIdsByAstNodeId = this.pickleIdsMapByUri.get(uri)!
    return astNodeId === undefined
      ? Array.from(new Set(pickleIdsByAstNodeId.values()))
      : pickleIdsByAstNodeId.get(astNodeId)
  }

  public getPickleStepIds(astNodeId: string): readonly string[] {
    return this.pickleStepIdsByAstNodeId.get(astNodeId) || []
  }

  public update(message: messages.IEnvelope): Query {
    if (message.gherkinDocument) {
      this.gherkinDocuments.push(message.gherkinDocument)

      if (message.gherkinDocument.feature) {
        if (!message.gherkinDocument.uri)
          throw new Error('Missing uri on gherkinDocument')
        this.pickleIdsMapByUri.set(
          message.gherkinDocument.uri,
          new ArrayMultimap<string, string>()
        )

        for (const featureChild of message.gherkinDocument.feature.children ||
          []) {
          if (featureChild.background) {
            this.updateGherkinBackground(featureChild.background)
          }

          if (featureChild.scenario) {
            this.updateGherkinScenario(featureChild.scenario)
          }

          if (featureChild.rule) {
            for (const ruleChild of featureChild.rule.children || []) {
              if (ruleChild.background) {
                this.updateGherkinBackground(ruleChild.background)
              }

              if (ruleChild.scenario) {
                this.updateGherkinScenario(ruleChild.scenario)
              }
            }
          }
        }
      }
    }

    if (message.pickle) {
      const pickle = message.pickle
      this.updatePickle(pickle)
    }

    return this
  }

  private updateGherkinBackground(
    background: messages.GherkinDocument.Feature.IBackground
  ) {
    for (const step of background.steps || []) {
      this.updateGherkinStep(step)
    }
  }

  private updateGherkinScenario(
    scenario: messages.GherkinDocument.Feature.IScenario
  ) {
    if (!scenario.id) throw new Error('No scenario id')
    if (!scenario.location) throw new Error('No scenario location')
    this.locationByAstNodeId.set(scenario.id, scenario.location)
    for (const step of scenario.steps || []) {
      this.updateGherkinStep(step)
    }

    for (const examples of scenario.examples || []) {
      for (const tableRow of examples.tableBody || []) {
        if (!tableRow.id) throw new Error('No tableRow id')
        if (!tableRow.location) throw new Error('No tableRow location')
        this.locationByAstNodeId.set(tableRow.id, tableRow.location)
      }
    }
  }

  private updateGherkinStep(step: messages.GherkinDocument.Feature.IStep) {
    if (!step.id) throw new Error('No step id')
    if (!step.location) throw new Error('No step location')
    this.locationByAstNodeId.set(step.id, step.location)
    this.gherkinStepById.set(step.id, step)
  }

  private updatePickle(pickle: messages.IPickle) {
    if (!pickle.uri) throw new Error('No pickle uri')
    if (!pickle.id) throw new Error('No pickle id')

    const pickleIdsByLineNumber = this.pickleIdsMapByUri.get(pickle.uri)
    if (!pickleIdsByLineNumber)
      throw new Error(`No pickleIds for uri: ${pickle.uri}`)

    for (const astNodeId of pickle.astNodeIds || []) {
      pickleIdsByLineNumber.put(astNodeId, pickle.id)
    }
    this.updatePickleSteps(pickle)
    this.pickles.push(pickle)

    for (const astNodeId of pickle.astNodeIds || []) {
      if (!this.pickleIdsByAstNodeId.has(astNodeId)) {
        this.pickleIdsByAstNodeId.set(astNodeId, [])
      }
      this.pickleIdsByAstNodeId.get(astNodeId)!.push(pickle.id)
    }
  }

  private updatePickleSteps(pickle: messages.IPickle) {
    for (const pickleStep of pickle.steps || []) {
      if (!pickleStep.id) throw new Error('No pickleStep id')
      for (const astNodeId of pickleStep.astNodeIds || []) {
        if (!this.pickleStepIdsByAstNodeId.has(astNodeId)) {
          this.pickleStepIdsByAstNodeId.set(astNodeId, [])
        }
        this.pickleStepIdsByAstNodeId.get(astNodeId)!.push(pickleStep.id)
      }
    }
  }
}

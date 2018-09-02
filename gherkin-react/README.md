# Gherkin-React

Gherkin-React is a set of React components for rendering Gherkin documents and Cucumber results.
There is an `App` that renders a navigation pane and a search bar for Gherkin documents, and a
document pane where the current Gherkin document is rendered.

There is also a `GherkinDocument` component, which is designed to render just a single document.

Gherkin-React is configured with a message provider, which will stream cucumber messages to the component, which
will update accordingly. Internally this uses Redux, but this is opaque to the users of the component.
You can use this component even if you're not using Redux.

There are built-in message providers for base64-encoded messages embedded in a page as well as streaming over
a WebSocket. Other message providers can be implemented to source messages from another source, for example
polling a CI server for a cucumber.bin log file, or querying a service for messages pertaining to specific criteria,
such as tags, paths, git revisions etc. One such service is [Cucumber-Reports](#) which serves an enhanced
version of the Gherkin `App`, with advanced features such as trend metrics, collaborative editing, example
mapping, JIRA integration and more.

The encoding of the messages are based on [cucumber-messages](https://github.com/cucumber/cucumber/tree/master/messages),
which is based on [Protocol Buffers](https://developers.google.com/protocol-buffers/).

The easiest way to try the component out with real data is via the [cucumber-html](#) reporter and the
[gherkin command line](#):

    cucumber-html --port 8090 --messages cucumber-html-pipe &
    open http://localhost:8090
    gherkin features/*.feature --fake-results > cucumber-html-pipe

That's it! you should see some nicely rendered Gherkin in your browser.

## Build / hack

    npm install
    # Work around a bug in cucumber-messages' build (typescript defs not included)
    mkdir -p node_modules/cucumber-messages/dist/src
    cp node_modules/cucumber-messages/src/cucumber-messages.d.ts node_modules/cucumber-messages/dist/src
    # Build code
    ./node_modules/.bin/webpack --mode development --watch

Update messages:

    ../gherkin/go/bin/gherkin --no-source --no-pickles --fake-results testdata/test.feature | base64 | pbcopy
    # Paste into `#messages` in `index.html`.

Take a gander:

    open index.html
    
## Ideas

### `ScenarioList` component

A component that renders a list of scenarios (possibly from multiple files, filtered by e.g. tag). 

This component could be used to render relevant scenarios in 3rd-party tools, such as JIRA, Confluence
and various issue trackers that support plugins.

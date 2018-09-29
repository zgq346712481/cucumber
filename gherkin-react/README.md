# Gherkin-React

Gherkin-React is a set of React components for rendering Gherkin documents and Cucumber results.
There is an `App` that renders a navigation pane and a search bar for Gherkin documents, and a
document pane where the current Gherkin document is rendered.

There is also a `GherkinDocument` component, which is designed to render just a single document.

Gherkin-React is configured with a message provider, which will stream cucumber messages to the component, which
will update accordingly. Internally this uses Redux, but this is opaque to the users of the component.
You can use Gherkin-React even if you're not using Redux.

There are built-in message providers for base64-encoded messages embedded in a page as well as streaming over
a WebSocket. Other message providers can be implemented stream messages from another source, for example
polling a CI server for a cucumber.bin log file, or querying a service for messages pertaining to specific criteria,
such as tags, paths, git revisions etc. One such service is [Cucumber-Reports](#) which serves an enhanced
version of the `App`, with advanced features such as trend metrics, collaborative editing, example
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
    ./node_modules/.bin/webpack --mode development --watch

Take a gander:

    open index.html
    
Update messages:

    ../gherkin/go/bin/gherkin --no-source --no-pickles --fake-results testdata/*.feature | base64 | pbcopy
    # Paste into `#messages` in `index.html`.

## Ideas

### `ScenarioList` component

A component that renders a list of scenarios (possibly from multiple files, filtered by e.g. tag). 

This component could be used to render relevant scenarios in 3rd-party tools, such as JIRA, Confluence
and various issue trackers that support plugins.

### Link to JIRA

Configure with a regexp and url function, and tags will be rendered as JIRA issue links

## Search

Upper left corner has search. Search by tag, but also by text. Could use http://elasticlunr.com/
or https://lunrjs.com/

## Search results

Each scenario displayed underneath each other, grouped by feature file. The feature description is "collapsed", 
(unless it contains the search term) but can be opened.

## Filtering / sorting

* by tag
* by duration (find slow ones)
* by status
* by recency (update timestamp) - exclude old ones
* by flickeriness

## Tag search

* Render a tag cloud for all tags
  * Size: count
  * Color: pass/fail/undefined
    
## On-demand data

For large reports (especially with screenshots) it may be too heavy to store it all in the browser.
The GUI should request data for the current document on demand. The GUI should also be able to filter
what kind of events it wants. For example, to render the initial screen.

## Server / App

It should be easy to use. Just run the app (Electron). It will create a named pipe where
it will listen. What's written here gets written straight to the React app (no websocket,
it's in the same process). This app can be fairly small.

## Rerun tests
Add a message to represent a config+cwd+env for a run, so the GUI can rerun it.
The config is essentially command line options. They can be modified in the gui.
Rerun on file change can also be set up. This just makes the whole DX simple.

## Alerts

The app could use the OS to send screen messages (autotest like)

## TODO / PLAN

* Design a layout on paper (take pictures)
* Write tests (with Enzyme)

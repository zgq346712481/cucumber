# GherkinDocument-React

Render GherkinDocument documents with React:

```jsx
<GherkinDocument gherkinDocument={gherkinDocument} />
```

## Build / hack

    npm install
    # Work around a bug in cucumber-messages' build
    cp node_modules/cucumber-messages/src/cucumber-messages.d.ts node_modules/cucumber-messages/dist/src
    ./node_modules/.bin/webpack --mode development

Update messages:

    ../gherkin/go/bin/gherkin --no-source --no-pickles --fake-results testdata/test.feature | base64 | pbcopy
    # Paste into `#messages` in `index.html`.

Take a gander:

    open index.html
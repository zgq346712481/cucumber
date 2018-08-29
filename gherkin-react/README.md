# Gherkin-React

Render Gherkin documents with React:

```jsx
<Gherkin gherkinDocument={gherkinDocument} />
```

## Build / hack

    npm install
    # Work around a bug in cucumber-messages' build
    cp node_modules/cucumber-messages/src/cucumber-messages.d.ts node_modules/cucumber-messages/dist/src
    ./node_modules/.bin/tsc
    ./node_modules/.bin/webpack --mode development

Take a gander:

    open index.html
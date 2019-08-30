module io.cucumber.gherkin {
    exports gherkin;
    opens gherkin.ast to io.cucumber.gherkin.jvm.deps;
    opens gherkin.pickles to io.cucumber.gherkin.jvm.deps;
    requires io.cucumber.gherkin.jvm.deps;
}

package gherkin;

import org.junit.jupiter.api.Test;

import static gherkin.SymbolCounter.countSymbols;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class GherkinDialectProviderTest {

    @Test
    public void providesEmojiDialect() {
        GherkinDialect em = new GherkinDialectProvider().getDialect("em", null);
        assertEquals(1, countSymbols(em.getScenarioKeywords().get(0)));
    }

}

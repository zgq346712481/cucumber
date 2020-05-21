package io.cucumber.cucumberexpressions;


import org.junit.jupiter.api.Test;

import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.ALTERNATION;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.BEGIN_OPTIONAL;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.BEGIN_PARAMETER;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.END_OPTIONAL;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.END_PARAMETER;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.TEXT;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.WHITE_SPACE;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;

class TokenScannerTest {

    private int startPosition = 0;

    @Test
    void emptyString() {
        assertThat(TokenScanner.tokenize(""), empty());
    }

    @Test
    void phrase() {
        assertThat(TokenScanner.tokenize("three blind mice"), contains(
                new Token("three", TEXT, startPosition),
                new Token(" ", WHITE_SPACE, startPosition),
                new Token("blind", TEXT, startPosition),
                new Token(" ", WHITE_SPACE, startPosition),
                new Token("mice", TEXT, startPosition)
        ));
    }

    @Test
    void optional() {
        assertThat(TokenScanner.tokenize("(blind)"), contains(
                new Token("(", BEGIN_OPTIONAL, startPosition),
                new Token("blind", TEXT, startPosition),
                new Token(")", END_OPTIONAL, startPosition)
        ));
    }

    @Test
    void escapedOptional() {
        assertThat(TokenScanner.tokenize("\\(blind\\)"), contains(
                new Token("\\(", TEXT, startPosition),
                new Token("blind", TEXT, startPosition),
                new Token("\\)", TEXT, startPosition)
        ));
    }

    @Test
    void optionalPhrase() {
        assertThat(TokenScanner.tokenize("three (blind) mice"), contains(
                new Token("three", TEXT, startPosition),
                new Token(" ", WHITE_SPACE, startPosition),
                new Token("(", BEGIN_OPTIONAL, startPosition),
                new Token("blind", TEXT, startPosition),
                new Token(")", END_OPTIONAL, startPosition),
                new Token(" ", WHITE_SPACE, startPosition),
                new Token("mice", TEXT, startPosition)
        ));
    }

    @Test
    void parameter() {
        assertThat(TokenScanner.tokenize("{string}"), contains(
                new Token("{", BEGIN_PARAMETER, startPosition),
                new Token("string", TEXT, startPosition),
                new Token("}", END_PARAMETER, startPosition)
        ));
    }

    @Test
    void EscapedParameter() {
        assertThat(TokenScanner.tokenize("\\{string\\}"), contains(
                new Token("\\{", TEXT, startPosition),
                new Token("string", TEXT, startPosition),
                new Token("\\}", TEXT, startPosition)
        ));
    }

    @Test
    void parameterPhrase() {
        assertThat(TokenScanner.tokenize("three {string} mice"), contains(
                new Token("three", TEXT, startPosition),
                new Token(" ", WHITE_SPACE, startPosition),
                new Token("{", BEGIN_PARAMETER, startPosition),
                new Token("string", TEXT, startPosition),
                new Token("}", END_PARAMETER, startPosition),
                new Token(" ", WHITE_SPACE, startPosition),
                new Token("mice", TEXT, startPosition)
        ));
    }


    @Test
    void alternation() {
        assertThat(TokenScanner.tokenize("blind/cripple"), contains(
                new Token("blind", TEXT, startPosition),
                new Token("/", ALTERNATION, startPosition),
                new Token("cripple", TEXT, startPosition)
        ));
    }

    @Test
    void escapedAlternation() {
        assertThat(TokenScanner.tokenize("blind\\ and\\ famished\\/cripple mice"), contains(
                new Token("blind", TEXT, startPosition),
                new Token("\\ ", TEXT, startPosition),
                new Token("and", TEXT, startPosition),
                new Token("\\ ", TEXT, startPosition),
                new Token("famished", TEXT, startPosition),
                new Token("\\/", TEXT, startPosition),
                new Token("cripple", TEXT, startPosition),
                new Token(" ", WHITE_SPACE, startPosition),
                new Token("mice", TEXT, startPosition)
        ));
    }

    @Test
    void alternationPhrase() {
        assertThat(TokenScanner.tokenize("three blind/cripple mice"), contains(
                new Token("three", TEXT, startPosition),
                new Token(" ", WHITE_SPACE, startPosition),
                new Token("blind", TEXT, startPosition),
                new Token("/", ALTERNATION, startPosition),
                new Token("cripple", TEXT, startPosition),
                new Token(" ", WHITE_SPACE, startPosition),
                new Token("mice", TEXT, startPosition)
        ));
    }
}

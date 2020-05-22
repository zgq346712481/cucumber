package io.cucumber.cucumberexpressions;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.ALTERNATION;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.BEGIN_OPTIONAL;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.BEGIN_PARAMETER;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.END_OPTIONAL;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.END_PARAMETER;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.EOF;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.TEXT;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.WHITE_SPACE;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;

class CucumberExpressionTokenizerTest {

    private final CucumberExpressionTokenizer tokenizer = new CucumberExpressionTokenizer();

    @Test
    void emptyString() {
        assertThat(tokensFrom(""), contains(
                new Token("", EOF)
        ));
    }

    @Test
    void phrase() {
        assertThat(tokensFrom("three blind mice"), contains(
                new Token("three", TEXT),
                new Token(" ", WHITE_SPACE),
                new Token("blind", TEXT),
                new Token(" ", WHITE_SPACE),
                new Token("mice", TEXT),
                new Token("", EOF)
        ));
    }

    @Test
    void optional() {
        assertThat(tokensFrom("(blind)"), contains(
                new Token("(", BEGIN_OPTIONAL),
                new Token("blind", TEXT),
                new Token(")", END_OPTIONAL),
                new Token("", EOF)
        ));
    }

   @Test
    void repeatedBeginOptional() {
        assertThat(tokensFrom("(("), contains(
                new Token("(", BEGIN_OPTIONAL),
                new Token("(", BEGIN_OPTIONAL),
                new Token("", EOF)
        ));
    }

    @Test
    void escapedOptional() {
        assertThat(tokensFrom("\\(blind\\)"), contains(
                new Token("(blind)", TEXT),
                new Token("", EOF)
        ));
    }

    @Test
    void optionalPhrase() {
        assertThat(tokensFrom("three (blind) mice"), contains(
                new Token("three", TEXT),
                new Token(" ", WHITE_SPACE),
                new Token("(", BEGIN_OPTIONAL),
                new Token("blind", TEXT),
                new Token(")", END_OPTIONAL),
                new Token(" ", WHITE_SPACE),
                new Token("mice", TEXT),
                new Token("", EOF)
        ));
    }

    @Test
    void parameter() {
        assertThat(tokensFrom("{string}"), contains(
                new Token("{", BEGIN_PARAMETER),
                new Token("string", TEXT),
                new Token("}", END_PARAMETER),
                new Token("", EOF)
        ));
    }

    @Test
    void repeatedBeginParameter() {
        assertThat(tokensFrom("{{"), contains(
                new Token("{", BEGIN_PARAMETER),
                new Token("{", BEGIN_PARAMETER),
                new Token("", EOF)
        ));
    }

    @Test
    void escapedParameter() {
        assertThat(tokensFrom("\\{string\\}"), contains(
                new Token("{string}", TEXT),
                new Token("", EOF)
        ));
    }

    @Test
    void parameterPhrase() {
        assertThat(tokensFrom("three {string} mice"), contains(
                new Token("three", TEXT),
                new Token(" ", WHITE_SPACE),
                new Token("{", BEGIN_PARAMETER),
                new Token("string", TEXT),
                new Token("}", END_PARAMETER),
                new Token(" ", WHITE_SPACE),
                new Token("mice", TEXT),
                new Token("", EOF)
        ));
    }

    @Test
    void alternation() {
        assertThat(tokensFrom("blind/cripple"), contains(
                new Token("blind", TEXT),
                new Token("/", ALTERNATION),
                new Token("cripple", TEXT),
                new Token("", EOF)
        ));
    }

    @Test
    void repeatedAlternation() {
        assertThat(tokensFrom("//"), contains(
                new Token("/", ALTERNATION),
                new Token("/", ALTERNATION),
                new Token("", EOF)
        ));
    }

    @Test
    void escapedAlternation() {
        assertThat(tokensFrom("blind\\ and\\ famished\\/cripple mice"), contains(
                new Token("blind and famished/cripple", TEXT),
                new Token(" ", WHITE_SPACE),
                new Token("mice", TEXT),
                new Token("", EOF)
        ));
    }

    @Test
    void alternationPhrase() {
        assertThat(tokensFrom("three blind/cripple mice"), contains(
                new Token("three", TEXT),
                new Token(" ", WHITE_SPACE),
                new Token("blind", TEXT),
                new Token("/", ALTERNATION),
                new Token("cripple", TEXT),
                new Token(" ", WHITE_SPACE),
                new Token("mice", TEXT),
                new Token("", EOF)
        ));
    }

    private List<Token> tokensFrom(String s) {
        List<Token> tokens = new ArrayList<>();
        tokenizer.tokenize(s).forEach(tokens::add);
        return tokens;
    }

}

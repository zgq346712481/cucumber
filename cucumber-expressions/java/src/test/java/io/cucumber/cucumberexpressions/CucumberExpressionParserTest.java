package io.cucumber.cucumberexpressions;

import io.cucumber.cucumberexpressions.CucumberExpressionParser.Builder;
import io.cucumber.cucumberexpressions.CucumberExpressionParser.RuleType;
import org.junit.jupiter.api.Test;

import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.BEGIN_OPTIONAL;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.BEGIN_PARAMETER;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.END_OPTIONAL;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.TEXT;
import static io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType.WHITE_SPACE;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

class CucumberExpressionParserTest {

    private final Builder<AstNode> builder = new AstBuilder();
    private final CucumberExpressionParser<AstNode> parser = new CucumberExpressionParser<>(builder);

    @Test
    void emptyString() {
        assertThat(astOf(""), equalTo(
                new AstNode(RuleType.CucumberExpression)
        ));
    }

    @Test
    void phrase() {
        assertThat(astOf("three blind mice"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("three blind mice", TEXT))
                )
        ));
    }

    @Test
    void optional() {
        assertThat(astOf("(blind)"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Optional,
                                new AstNode(RuleType.Text, new Token("blind", TEXT))
                        )
                )
        ));
    }

    @Test
    void parameter() {
        assertThat(astOf("{string}"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Parameter,
                                new AstNode(RuleType.Text, new Token("string", TEXT))
                        )
                )
        ));
    }

    @Test
    void anonymousParameter() {
        assertThat(astOf("{}"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Parameter)
                )
        ));
    }

    @Test
    void optionalPhrase() {
        assertThat(astOf("three (blind) mice"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("three ", TEXT)),
                        new AstNode(RuleType.Optional,
                                new AstNode(RuleType.Text, new Token("blind", TEXT))
                        ),
                        new AstNode(RuleType.Text, new Token(" mice", TEXT))
                )
        ));
    }

    @Test
    void optionalWithSpace() {
        assertThat(astOf("(blind mice)"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Optional,
                                new AstNode(RuleType.Text, new Token("blind mice", TEXT))
                        )
                )
        ));
    }

    @Test
    void slash() {
        assertThat(astOf("\\"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("\\", TEXT))
                )
        ));
    }

    @Test
    void openingBrace() {
        assertThat(astOf("{"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("{", BEGIN_PARAMETER))
                )
        ));
    }

    @Test
    void unfinishedParameter() {
        assertThat(astOf("{string"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("{", BEGIN_PARAMETER)),
                        new AstNode(RuleType.Text, new Token("string", TEXT))
                )
        ));
    }

    @Test
    void openingParenthesis() {
        assertThat(astOf("("), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("(", BEGIN_OPTIONAL))
                )
        ));
    }

    @Test
    void escapedOpeningParenthesis() {
        assertThat(astOf("\\("), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("(", TEXT))
                )
        ));
    }

    @Test
    void escapedOptional() {
        assertThat(astOf("\\(blind\\)"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("(blind)", TEXT))
                )
        ));
    }

    @Test
    void escapedOptionalPhrase() {
        assertThat(astOf("three \\(blind\\) mice"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("three (blind) mice", TEXT))
                )
        ));
    }

    @Test
    void escapedOptionalFollowedByOptional() {
        assertThat(astOf("three \\((very) blind\\) mice"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("three (", TEXT)),
                        new AstNode(RuleType.Optional,
                                new AstNode(RuleType.Text, new Token("very", TEXT))
                        ),
                        new AstNode(RuleType.Text, new Token(" blind) mice", TEXT))
                )
        ));
    }

    @Test
    void optionalContainingEscapedOptional() {
        assertThat(astOf("three ((very\\) blind) mice"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("three ", TEXT)),
                        new AstNode(RuleType.Optional,
                                new AstNode(RuleType.Text, new Token("(very) blind", TEXT))
                        ),
                        new AstNode(RuleType.Text, new Token(" mice", TEXT))
                )
        ));
    }


    @Test
    void alternation() {
        assertThat(astOf("mice/rats"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Alternation,
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("mice", TEXT))
                                ),
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("rats", TEXT)))
                        )
                )
        ));
    }

    @Test
    void escapedAlternation() {
        assertThat(astOf("mice\\/rats"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("mice/rats", TEXT))
                )
        ));
    }


    @Test
    void alternationPhrase() {
        assertThat(astOf("three hungry/blind mice"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("three ", TEXT)),
                        new AstNode(RuleType.Alternation,
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("hungry", TEXT))
                                ),
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("blind", TEXT))
                                )
                        ),
                        new AstNode(RuleType.Text, new Token(" mice", TEXT))
                )
        ));
    }

    @Test
    void alternationWithWhiteSpace() {
        assertThat(astOf("\\ three\\ hungry/blind\\ mice\\ "), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Alternation,
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token(" three hungry", TEXT))
                                ),
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("blind mice ", TEXT))
                                )
                        )

                )
        ));
    }

    @Test
    void alternationWithUnusedEndOptional() {
        assertThat(astOf("three )blind\\ mice/rats"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("three", TEXT)),
                        new AstNode(RuleType.Text, new Token(" ", WHITE_SPACE)),
                        new AstNode(RuleType.Alternation,
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token(")", END_OPTIONAL)),
                                        new AstNode(RuleType.Text, new Token("blind", TEXT)),
                                        new AstNode(RuleType.Text, new Token(" ", WHITE_SPACE)),
                                        new AstNode(RuleType.Text, new Token("mice", TEXT))
                                ),
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("rats", TEXT))
                                )
                        )
                )
        ));
    }

    @Test
    void alternationWithUnusedStartOptional() {
        assertThat(astOf("three blind\\ mice/rats("), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("three", TEXT)),
                        new AstNode(RuleType.Text, new Token(" ", WHITE_SPACE)),
                        new AstNode(RuleType.Alternation,
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("blind", TEXT)),
                                        new AstNode(RuleType.Text, new Token(" ", WHITE_SPACE)),
                                        new AstNode(RuleType.Text, new Token("mice", TEXT))
                                ),
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("rats", TEXT)),
                                        new AstNode(RuleType.Text, new Token("(", BEGIN_OPTIONAL))
                                )
                        )
                )
        ));
    }

    @Test
    void alternationFollowedByOptional() {
        assertThat(astOf("three blind\\ rat/cat(s)"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("three ", TEXT)),
                        new AstNode(RuleType.Alternation,
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("blind rat", TEXT))
                                ),
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("cat", TEXT)),
                                        new AstNode(RuleType.Optional,
                                                new AstNode(RuleType.Text, new Token("s", TEXT))
                                        )
                                )
                        )
                )
        ));
    }

    @Test
    void alternationFollowedByOptionalVariation() {
        assertThat(astOf("(three )rats/(some )cats"), equalTo(
                new AstNode(RuleType.CucumberExpression,
                        new AstNode(RuleType.Text, new Token("three ", TEXT)),
                        new AstNode(RuleType.Alternation,
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("blind rat", TEXT))
                                ),
                                new AstNode(RuleType.Alternate,
                                        new AstNode(RuleType.Text, new Token("cat", TEXT)),
                                        new AstNode(RuleType.Optional,
                                                new AstNode(RuleType.Text, new Token("s", TEXT))
                                        )
                                )
                        )
                )
        ));
    }

    private AstNode astOf(String expression) {
        return parser.parse(new CucumberExpressionTokenizer().tokenize(expression));
    }

}

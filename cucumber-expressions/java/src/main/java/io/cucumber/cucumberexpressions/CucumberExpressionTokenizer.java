package io.cucumber.cucumberexpressions;

import io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType;

import java.util.List;
import java.util.stream.Collectors;

final class CucumberExpressionTokenizer {

    List<Token> tokenize(String expression) {
        //TODO: More efficient plz.
        return expression.codePoints().mapToObj(
                codePoint -> {
                    //TODO: Java 11 allows us to use Character.codePointOf()
                    StringBuilder builder = new StringBuilder();
                    builder.appendCodePoint(codePoint);
                    return new Token(builder.toString(), tokenTypeOf(codePoint));
                }
        ).collect(Collectors.toList());
    }

    private TokenType tokenTypeOf(Integer c) {
        sw

        return null;
    }

}

package io.cucumber.cucumberexpressions;

import io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType;

import java.util.Objects;

final class Token {

    final String text;
    final TokenType tokenType;

    Token(String text, TokenType tokenType) {
        //TODO:
        this(text, tokenType, -1);
    }
    Token(String text, TokenType tokenType, int startPosition) {
        this.text = text;
        this.tokenType = tokenType;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Token token = (Token) o;
        return text.equals(token.text) &&
                tokenType == token.tokenType;
    }

    @Override
    public int hashCode() {
        return Objects.hash(text, tokenType);
    }

    @Override
    public String toString() {
        return "Token{" +
                "text='" + text + '\'' +
                ", type=" + tokenType +
                '}';
    }

    public boolean isEOF() {
        return this.tokenType == TokenType.EOF;
    }

    public void detach() {

    }

}

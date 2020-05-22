package io.cucumber.cucumberexpressions;

import io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType;

import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.PrimitiveIterator.OfInt;

final class CucumberExpressionTokenizer {

    Iterable<Token> tokenize(String expression) {
        return () -> new Iterator<Token>() {
            final OfInt codePoints = expression.codePoints().iterator();
            StringBuilder buffer = new StringBuilder();
            TokenType previousTokenType = null;
            TokenType currentTokenType = null;
            boolean treatAsText = false;

            @Override
            public boolean hasNext() {
                return previousTokenType != TokenType.EOF;
            }

            @Override
            public Token next() {
                if (!hasNext()) {
                    throw new NoSuchElementException();
                }

                while (codePoints.hasNext()) {
                    int current = codePoints.nextInt();
                    if (current == '\\') {
                        treatAsText = true;
                        continue;
                    }
                    currentTokenType = tokenTypeOf(current, treatAsText);
                    treatAsText = false;

                    if (previousTokenType != null
                            && (currentTokenType != previousTokenType
                            || (currentTokenType != TokenType.WHITE_SPACE && currentTokenType != TokenType.TEXT))) {
                        Token t = new Token(buffer.toString(), previousTokenType);
                        buffer = new StringBuilder();
                        buffer.appendCodePoint(current);
                        previousTokenType = currentTokenType;
                        return t;
                    }
                    buffer.appendCodePoint(current);
                    previousTokenType = currentTokenType;
                }

                if (buffer.length() > 0) {
                    Token t = new Token(buffer.toString(), previousTokenType);
                    buffer = new StringBuilder();
                    currentTokenType = TokenType.EOF;
                    return t;
                }

                currentTokenType = null;
                previousTokenType = TokenType.EOF;
                Token t = new Token(buffer.toString(), previousTokenType);
                buffer = new StringBuilder();
                return t;
            }
        };

    }

    private TokenType tokenTypeOf(Integer c, boolean treatAsText) {
        if (treatAsText) {
            return TokenType.TEXT;
        }

        if (Character.isWhitespace(c)) {
            return TokenType.WHITE_SPACE;
        }

        switch (c) {
            case (int) '/':
                return TokenType.ALTERNATION;
            case (int) '{':
                return TokenType.BEGIN_PARAMETER;
            case (int) '}':
                return TokenType.END_PARAMETER;
            case (int) '(':
                return TokenType.BEGIN_OPTIONAL;
            case (int) ')':
                return TokenType.END_OPTIONAL;
        }
        return TokenType.TEXT;
    }

}

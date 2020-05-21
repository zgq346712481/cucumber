package io.cucumber.cucumberexpressions;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;



final class CucumberExpressionTokenizer {

    private interface Tokenizer {
        int tokenize(List<Token> tokens, String expression, int current);
    }

    private static final List<Tokenizer> tokenizers = Arrays.asList(
            tokenizePattern(WHITE_SPACE, Pattern.compile("\\s+")),

            tokenizeString(BEGIN_OPTIONAL_ESCAPED, "\\("),
            tokenizeCharacter(BEGIN_OPTIONAL, '('),

            tokenizeString(END_OPTIONAL_ESCAPED, "\\)"),
            tokenizeCharacter(END_OPTIONAL, ')'),

            tokenizeString(BEGIN_PARAMETER_ESCAPED, "\\{"),
            tokenizeCharacter(BEGIN_PARAMETER, '{'),

            tokenizeString(END_PARAMETER_ESCAPED, "\\}"),
            tokenizeCharacter(END_PARAMETER, '}'),

            tokenizeString(ALTERNATION_ESCAPED, "\\/"),
            tokenizeCharacter(ALTERNATION, '/'),

            tokenizeString(ESCAPE_ESCAPED, "\\\\"),
            tokenizeString(ESCAPE, "\\"),

            // Should be `.` but this creates a nicer parse tree.
            tokenizePattern(TEXT, Pattern.compile("[^(){}\\\\/\\s]+"))
    );

    /*
     * token := '\' + whitespace | whitespace | '\(' | '(' | '\)' | ')' |
     *          '\{' | '{' | '\}' | '}' | '\/' | '/' | '\\' | '\' | .
     */
    List<Token> tokenize(String expression) {
        List<Token> tokens = new ArrayList<>();
        int length = expression.length();
        int current = 0;
        while (current < length) {
            boolean tokenized = false;
            for (Tokenizer tokenizer : tokenizers) {
                int consumed = tokenizer.tokenize(tokens, expression, current);
                if (consumed != 0) {
                    current += consumed;
                    tokenized = true;
                    break;
                }
            }
            if (!tokenized) {
                // Can't happen if configured properly
                // Leave in to avoid looping if not configured properly
                throw new IllegalStateException("Could not tokenize " + expression);
            }
        }
        return tokens;
    }

    private static Tokenizer tokenizeCharacter(Token.Type type, char character) {
        return (tokens, expression, current) -> {
            if (character != expression.charAt(current)) {
                return 0;
            }
            tokens.add(new Token("" + character, type));
            return 1;
        };
    }

    private static Tokenizer tokenizeString(Token.Type type, String string) {
        return (tokens, expression, current) -> {
            if (!expression.regionMatches(current, string, 0, string.length())) {
                return 0;
            }
            tokens.add(new Token(string, type));
            return string.length();
        };
    }

    private static Tokenizer tokenizePattern(Token.Type type, Pattern pattern) {
        return (tokens, expression, current) -> {
            String tail = expression.substring(current);
            Matcher matcher = pattern.matcher(tail);
            if (!matcher.lookingAt()) {
                return 0;
            }
            String match = tail.substring(0, matcher.end());
            tokens.add(new Token(match, type));
            return match.length();
        };
    }


}

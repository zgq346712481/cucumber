package io.cucumber.cucumberexpressions;

import java.io.IOException;
import java.util.List;

public class ParserException extends RuntimeException {


    public ParserException() {

    }
    public ParserException(IOException e) {

    }

    public static class CompositeParserException extends ParserException {
        Iterable<? extends ParserException> errors;

        public CompositeParserException(List<ParserException> errors) {
        }

    }

    public static class UnexpectedEOFException extends ParserException {
        public UnexpectedEOFException(Token token, List<String> expectedTokens, String stateComment) {
            super();
        }

    }

    public static class UnexpectedTokenException extends ParserException {
        public UnexpectedTokenException(Token token, List<String> expectedTokens, String stateComment) {
            super();
        }

    }

}

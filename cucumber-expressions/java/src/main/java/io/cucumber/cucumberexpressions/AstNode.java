package io.cucumber.cucumberexpressions;

import io.cucumber.cucumberexpressions.CucumberExpressionParser.RuleType;

import java.util.List;
import java.util.Objects;

import static java.util.Arrays.asList;
import static java.util.stream.Collectors.joining;

final class AstNode {

    private final RuleType type;
    private final List<AstNode> nodes;
    private final Token token;

    AstNode(RuleType type, Token token) {
        this(type, null, token);
    }

    AstNode(RuleType type, AstNode... nodes) {
        this(type, asList(nodes));
    }

    AstNode(RuleType type, List<AstNode> nodes) {
        this(type, nodes, null);
    }

    private AstNode(RuleType type, List<AstNode> nodes, Token token) {
        this.type = type;
        this.nodes = nodes;
        this.token = token;
    }

    List<AstNode> getNodes() {
        return nodes;
    }

    RuleType getType() {
        return type;
    }

    String getText() {
        if (token != null)
            return token.text;

        return getNodes().stream()
                .map(AstNode::getText)
                .collect(joining());
    }

    @Override
    public String toString() {
        return "AstNode{" +
                "type=" + type +
                ", nodes=" + nodes +
                ", token=" + token +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        AstNode astNode = (AstNode) o;
        return type == astNode.type &&
                Objects.equals(nodes, astNode.nodes) &&
                Objects.equals(token, astNode.token);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, nodes, token);
    }

}

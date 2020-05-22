package io.cucumber.cucumberexpressions;

import io.cucumber.cucumberexpressions.CucumberExpressionParser.RuleType;
import io.cucumber.cucumberexpressions.CucumberExpressionParser.TokenType;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.List;

final class AstBuilder implements CucumberExpressionParser.Builder<AstNode> {

    private final List<TokenType> preserveTokens = Arrays.asList(TokenType.TEXT, TokenType.WHITE_SPACE);
    private final Deque<List<AstNode>> stack = new ArrayDeque<>();
    private Token token;

    @Override
    public void build(Token token) {
        if (preserveTokens.contains(token.tokenType)) {
            this.token = token;
        }
    }

    @Override
    public void startRule(RuleType ruleType) {
        stack.push(new ArrayList<>());
        if (ruleType == RuleType.CucumberExpression) {
            stack.push(new ArrayList<>());
        }
    }

    @Override
    public void endRule(RuleType ruleType) {
        List<AstNode> nodes = stack.pop();

        if (ruleType == RuleType.Alternation) {
            // Fold up sole alternatives
            if (nodes.size() == 1) {
                List<AstNode> soleAlternative = nodes.get(0).getNodes();
                stack.peek().addAll(soleAlternative);
                return;
            }
        }
        if (ruleType == RuleType.AlternateText) {
            ruleType = RuleType.Text;
        }
        if (ruleType == RuleType.Separator) {
            ruleType = RuleType.Text;
        }
        nodes = mergeTextNodes(nodes);
        AstNode e = createNodeForTokenOrRule(ruleType, nodes);
        stack.peek().add(e);

    }

    private List<AstNode> mergeTextNodes(List<AstNode> nodes) {
        if (nodes.size() <= 1) {
            return nodes;
        }

        List<AstNode> merged = new ArrayList<>();
        StringBuilder buffer = new StringBuilder();
        for (AstNode node : nodes) {
            if (node.getType() == RuleType.Text) {
                buffer.append(node.getText());
                continue;
            }
            if (buffer.length() > 0) {
                merged.add(new AstNode(RuleType.Text, new Token(buffer.toString(), TokenType.TEXT)));
                buffer = new StringBuilder();
            }
            merged.add(node);
        }

        if (buffer.length() > 0) {
            merged.add(new AstNode(RuleType.Text, new Token(buffer.toString(), TokenType.TEXT)));
        }

        return merged;
    }

    private AstNode createNodeForTokenOrRule(RuleType ruleType, List<AstNode> nodes) {
        // TODO: Constructor stuff here
        if (token != null) {
            AstNode e;
            e = new AstNode(ruleType, token);
            token = null;
            return e;
        } else {
            return new AstNode(ruleType, nodes);
        }
    }

    @Override
    public AstNode getResult() {
        return stack.peek().get(0);
    }

    @Override
    public void reset() {
        stack.clear();
        token = null;
    }

}

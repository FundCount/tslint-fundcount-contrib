import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "misplaced operator";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    }
}

class NoImportsWalker extends Lint.RuleWalker {
    public visitBinaryExpression(node: ts.BinaryExpression) {
        const opLine = this.getLineAndCharacterOfPosition(node.operatorToken.getEnd()).line;
        const rightLine = this.getLineAndCharacterOfPosition(node.right.getStart()).line;

        if (opLine !== rightLine) {
            this.addFailureAtNode(node.operatorToken, Rule.FAILURE_STRING);
        }

        super.visitBinaryExpression(node);
    }

    protected visitConditionalExpression(node: ts.ConditionalExpression) {
        const questionLine = this.getLineAndCharacterOfPosition(node.questionToken.getEnd()).line;
        const trueLine = this.getLineAndCharacterOfPosition(node.whenTrue.getStart()).line;

        if (questionLine !== trueLine) {
            this.addFailureAtNode(node.questionToken, Rule.FAILURE_STRING);
        }

        const colonLine = this.getLineAndCharacterOfPosition(node.colonToken.getEnd()).line;
        const falseLine = this.getLineAndCharacterOfPosition(node.whenFalse.getStart()).line;

        if (colonLine !== falseLine) {
            this.addFailureAtNode(node.colonToken, Rule.FAILURE_STRING);
        }

        super.visitConditionalExpression(node);
    }
}

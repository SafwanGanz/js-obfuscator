import { parse, generate } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { randomBytes } from 'crypto';

export class JSObfuscator {
  constructor(options = {}) {
    this.options = {
      renameVariables: true,
      encodeStrings: true,
      flattenControlFlow: true,
      injectDeadCode: true,
      ...options
    };
    this.variableMap = new Map();
  }

  generateIdentifier(length = 6) {
    return '_' + randomBytes(length).toString('hex').slice(0, length);
  }

  encodeString(str) {
    return Buffer.from(str).toString('hex');
  }

  getDecodeFunction() {
    const decodeName = this.generateIdentifier();
    return t.functionDeclaration(
      t.identifier(decodeName),
      [t.identifier('h')],
      t.blockStatement([
        t.returnStatement(
          t.callExpression(
            t.memberExpression(
              t.identifier('Buffer'),
              t.identifier('from')
            ),
            [t.identifier('h'), t.stringLiteral('hex')]
          )
        )
      ])
    );
  }

  obfuscate(code) {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    const visitor = {
      VariableDeclarator: (path) => {
        if (this.options.renameVariables) {
          const oldName = path.node.id.name;
          if (!this.variableMap.has(oldName)) {
            this.variableMap.set(oldName, this.generateIdentifier());
          }
          path.node.id = t.identifier(this.variableMap.get(oldName));
        }
      },

      StringLiteral: (path) => {
        if (this.options.encodeStrings) {
          const encoded = this.encodeString(path.node.value);
          path.replaceWith(
            t.callExpression(
              t.identifier('decodeString'),
              [t.stringLiteral(encoded)]
            )
          );
        }
      },

      IfStatement: (path) => {
        if (this.options.flattenControlFlow) {
          const cases = [
            t.switchCase(t.numericLiteral(0), [path.node.consequent]),
            t.switchCase(t.numericLiteral(1), [path.node.alternate || t.blockStatement([])])
          ];

          path.replaceWith(
            t.switchStatement(
              t.callExpression(
                t.memberExpression(
                  t.identifier('Math'),
                  t.identifier('random')
                ),
                []
              ),
              cases
            )
          );
        }
      }
    };

    traverse(ast, visitor);

    if (this.options.encodeStrings) {
      ast.program.body.unshift(this.getDecodeFunction());
    }

    if (this.options.injectDeadCode) {
      ast.program.body.push(
        t.ifStatement(
          t.binaryExpression('===', t.numericLiteral(1), t.numericLiteral(2)),
          t.blockStatement([
            t.expressionStatement(
              t.callExpression(t.identifier(this.generateIdentifier()), [])
            )
          ])
        )
      );
    }

    return generate(ast).code;
  }
}

export const obfuscate = (code, options) => new JSObfuscator(options).obfuscate(code);

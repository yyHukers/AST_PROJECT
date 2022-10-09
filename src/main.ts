import * as acorn from "acorn";
import estraverse from "estraverse";
import * as ESTree from "estree";
import escodegen from "escodegen";

const code = `
  (function() {
    const a = 1;
    console.log(123);
    if (a == 1) {
      console.log(2222);
      return;
    }
    function test() {
      console.log(123);
      return;
    }
    const wait = new Promise((resolve) => {
      setTimeout(() => {
        resolve(100);
      }, 1000)
    })
  })()
`;

const ToEqual = (node: ESTree.Node) => {
  if (node.type === "BinaryExpression") {
    if (node.operator === "==") {
      node.operator = "===";
    }
  }
};

function ArrowFunctionExpression(
  this: estraverse.Controller,
  node: ESTree.Node
) {
  if (node.type === "ArrowFunctionExpression") {
    let { params, body } = node;
    console.log("params: ", params);
    console.log("node: ", node);
    // this.remove();
  }
}

function FunctionExpression(
  this: estraverse.Controller,
  node: ESTree.Node
): void {
  if (node.type === "FunctionExpression") {
  }
}

function RemoveConsoleLog(
  this: estraverse.Controller,
  node: ESTree.Node
): void {
  if (node.type === "CallExpression") {
    const { callee } = node;
    if (
      callee.type === "MemberExpression" &&
      callee.object?.type === "Identifier" &&
      callee.object.name === "console" &&
      callee.property?.type === "Identifier" &&
      callee.property.name === "log"
    ) {
      this.remove();
    }
  }
}

class JavaScriptConfusion {
  private constructor(public code: string) {
    this.code = code;
  }
  private static instance: JavaScriptConfusion | null = null;
  private resultCode: string = "123";
  private static getInstance(code: string) {
    if (!this.instance) {
      this.instance = new JavaScriptConfusion(code);
    }
    return this.instance;
  }
  private static readonly parseOption: acorn.Options = {
    ecmaVersion: 6,
  };
  public static confusion(code: string) {
    const instance = JavaScriptConfusion.getInstance(code);
    // ①Code转AST🌲
    const Ast = acorn.parse(code, JavaScriptConfusion.parseOption);

    // ②操作AST
    estraverse.replace(Ast as ESTree.Node, {
      enter(node, parent) {
        ToEqual.call(this, node);
        ArrowFunctionExpression.call(this, node);
        FunctionExpression.call(this, node);
        RemoveConsoleLog.call(this, node);
      },
      leave(node) {
        if (node.type === "ExpressionStatement") {
          if (!node.expression) {
            this.remove();
          }
        }
      },
    });

    // ③AST转Code
    instance.resultCode = escodegen.generate(Ast);
    return instance;
  }

  private getObfuscationResult() {
    return this.obfuscationResultFactory();
  }

  private obfuscationResultFactory() {}

  /**
   * 获取混淆结果
   * @returns
   */
  public getConfusionCode() {
    return this.resultCode;
  }

  private generateCode() {}
  private parseCode(sourceCode: string) {
    return acorn.parse(sourceCode, {
      ecmaVersion: 6,
    });
  }
}

const confusionInstance = JavaScriptConfusion.confusion(code);
console.log("confusionInstance: ", confusionInstance);
console.log(confusionInstance.getConfusionCode());

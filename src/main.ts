import * as acorn from "acorn";
import estraverse from "estraverse";
import * as ESTree from "estree";
import escodegen from "escodegen";
import { generateName } from "./utils";
const dictCode = `
  const _0xd6ac = [];
  (function(_0x203a66, _0x6dd4f4) {
    var _0x3c5c81 = function(_0x4f427c) {
      while (--_0x4f427c) {
        _0x203a66['push'](_0x203a66['shift']());
      }
    };
    _0x3c5c81(++_0x6dd4f4);
  }(_0xd6ac, 0x6e));
  var _0x5b26 = function(_0x2d8f05, _0x4b81bb) {
    _0x2d8f05 = _0x2d8f05 - 0x0;
    var _0x4d74cb = _0xd6ac[_0x2d8f05];
    return _0x4d74cb;
  };
`;

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
    test();
  })()
`;

/**
 * == -> ===
 * @param node
 */
function ToEqual(node: ESTree.Node) {
  if (node.type === "BinaryExpression") {
    if (node.operator === "==") {
      node.operator = "===";
    }
  }
}

// 箭头函数
function ArrowFunctionExpression(
  this: estraverse.Controller,
  node: ESTree.Node
) {
  if (node.type === "ArrowFunctionExpression") {
    let { params, body } = node;
    // this.remove();
  }
}

// 方法名修改
function FunctionExpression(
  this: estraverse.Controller,
  node: ESTree.Node
): void {
  // if (node.type === "FunctionExpression") {
  //   for (const item of node?.body?.body) {
  //     if (item.type === "FunctionDeclaration") {
  //       if (item.id.type === "Identifier") {
  //         item.id.name = generateName(item.id.name);
  //       }
  //     }
  //   }
  // }
}

function FunctionDeclaration(
  this: estraverse.Controller,
  node: ESTree.Node
): void {
  if (node.type === "FunctionDeclaration") {
    console.log("node: ", node);
    // if (node.id.type === "Identifier") {
    //   node.id.name = generateName(node.id.name);
    // }
  }
}

// 🗑 删除consoole
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

function VariableDeclarator(
  this: estraverse.Controller,
  node: ESTree.Node
): void {
  if (node.type === "VariableDeclarator") {
    if (node.id.type === "Identifier") {
      node.id.name = generateName(node.id.name);
    }
  }
}

class JavaScriptConfusion {
  private constructor(public code: string) {
    this.code = code;
  }
  private static instance: JavaScriptConfusion | null = null;
  private resultCode: string = "";
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
    const Ast = acorn.parse(
      code,
      JavaScriptConfusion.parseOption
    ) as ESTree.Node;

    // 字典
    // const DictAst = acorn.parse(
    //   dictCode,
    //   JavaScriptConfusion.parseOption
    // ) as ESTree.Node;

    // if (Ast.type === "Program") {
    //   if (DictAst.type === "Program") {
    //     Ast.body.unshift(...DictAst?.body);
    //   }
    // }
    // ②操作AST
    // 对抽象语法树进行遍历和修改
    estraverse.replace(Ast, {
      enter(node, parent) {
        console.log('node: ', node);
        ToEqual.call(this, node);
        ArrowFunctionExpression.call(this, node);
        FunctionExpression.call(this, node);
        RemoveConsoleLog.call(this, node);
        VariableDeclarator.call(this, node);
        FunctionDeclaration.call(this, node);
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
    // 将修改后的抽象语法树重新转换为JS代码
    instance.resultCode = escodegen.generate(Ast);
    console.log("Ast: ", Ast);
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
console.log(confusionInstance.code);
console.log(confusionInstance.getConfusionCode());

import * as acorn from "acorn";
import estraverse from "estraverse";
import * as ESTree from "estree";
import escodegen from "escodegen";

const code = `
  const a = 1;
  const b = 1;
  const c = 1;
  const d = 1;
  const e = 1;
  function test() {
    console.log(123);
  }  
`;
const ast = acorn.parse(code, {
  ecmaVersion: 6,
});

// "VariableDeclaration" Const Var Let
// "Identifier" 属性名称
// "Literal" 值

estraverse.replace(ast, {
  enter: (node) => {
    
    console.log('node: ', node);
    if (node.type === "VariableDeclaration") {
      node.kind = "var";
    }
  },
  leave: (node) => {
  },
});

console.log(ast);
const gCode = escodegen.generate(ast);
console.log(gCode);

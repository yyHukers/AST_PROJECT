import acorn from "acorn";

const code = `const a = 1;`;
const ast = acorn.parse(code, {
  ecmaVersion: 6,
});
console.log(ast);

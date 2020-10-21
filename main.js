const { tokenizer } = require('./tokenizer')
const { parser } = require('./parser')
const { transformer } = require('./traverser')
const { codeGenerator } = require('./code_generator')

function compiler(input) {
  let tokens = tokenizer(input);
  let ast = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);

  return output;
}

console.log(compiler('(ADD 3 (SUBTRACT (ADD 25 2) (SUBTRACT 3 1)))'));
function parser(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (token.type === "number") {
      current++;

      return {
        type: "NumberLiteral",
        value: token.value,
      };
    }

    if (token.type === "string") {
      current++;

      return {
        type: "StringLiteral",
        value: token.value,
      };
    }

    // CallExpression을 생성해준다
    if (token.type === "paren" && token.value === "(") {
      // 우선 parenthesis 항목을 건너뛴다
      token = tokens[++current];

      // 여기 노드는 이제 name (ADD, SUBTRACT 등)에 대한 정보를 가지고 있는
      // CallExpression node가 된다
      let node = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };

      // 다음 token으로 넘어간다
      token = tokens[++current];

      // 지금부터 token들에 대해 loop을 시작하여
      // 닫는 parenthesis를 만나기 전까지 반복한다
      // 이렇게 되면, 중간에 닫는 parenthesis를 만나게 되면
      // 
      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        node.params.push(walk());
        token = tokens[current];
      }

      current++;

      return node;
    }

    throw new TypeError(token.type);
  }

  let ast = {
    type: 'Program',
    body: []
  }

  // 이제 walk를 시작하여
  // ast.body 내부에 token들을 전부 push 해준다
  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}

module.exports = {
  parser
}

// console.log(parser([
//   { type: 'paren', value: '(' },
//   { type: 'name', value: 'ADD' },
//   { type: 'number', value: '3' },
//   { type: 'paren', value: '(' },
//   { type: 'name', value: 'SUBTRACT' },
//   { type: 'number', value: '5' },
//   { type: 'number', value: '3' },
//   { type: 'paren', value: ')' },
//   { type: 'paren', value: ')' }
// ]).body[0].params)
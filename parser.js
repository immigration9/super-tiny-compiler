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
      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {}
    }
  }
}

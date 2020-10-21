const WHITESPACE = /\s/;
const NUMBERS = /[0-9]/;
const LETTERS = /[A-Z]/i;

function tokenizer(input) {
  // cursor 역할을 한다
  let current = 0;

  let tokens = [];

  while (current < input.length) {
    // 현재 input의 cursor에 해당하는 character를 반환
    let char = input[current];

    if (char === "(") {
      tokens.push({ type: "paren", value: "(" });

      current++;
      continue;
    }

    if (char === ")") {
      tokens.push({ type: "paren", value: ")" });

      current++;
      continue;
    }

    // 빈카에 대한 처리
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    if (NUMBERS.test(char)) {
      let value = "";

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: "number", value });

      continue;
    }

    if (char === '"') {
      let value = "";

      // 여는 quote 다음 글자부터 시작
      char = input[++current];

      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      // Skip 닫는 quote
      current++;
      tokens.push({ type: "string", value });

      continue;
    }

    if (LETTERS.test(char)) {
      let value = "";

      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: "name", value });

      continue;
    }

    throw new TypeError("Character not found: " + char);
  }

  return tokens;
}

module.exports = {
  tokenizer,
};

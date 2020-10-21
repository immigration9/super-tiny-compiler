// Node 전체를 순회한다
// visitor에는 이제 해당 ast tree를 어떻게 처리할 것인지에 대한
// 견적서 같은게 넘어온다고 생각하면 된다
function traverser(ast, visitor) {
  // traverse array는 array를 순회하며
  // traverseNode를 실행한다
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    })
  }

  function traverseNode(node, parent) {
    let methods = visitor[node.type];

    // enter method가 있으면 실행한다
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    // Node Type에 따라 다른 코드를 실행한다
    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node);
        break;

      case 'CallExpression':
        traverseArray(node.params, node);
        break;

      // Number와 StringLiteral의 경우
      // Child node가 없기 때문에 여기서 작업을 마무리 한다
      case 'NumberLiteral':
      case 'StringLiteral':
        break;

      default:
        throw new TypeError(node.type);
    }

    // exit method가 있으면 실행한다
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }
  traverseNode(ast, null);
}

function transformer(ast) {
  let newAst = {
    type: 'Program',
    body: []
  }

  ast._context = newAst.body;

  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value
        })
      }
    },
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value
        })
      }
    },
    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name
          },
          arguments: []
        }

        node._context = expression.arguments;

        if (parent.type !== 'CallExpression') {
          expression = {
            type: 'ExpressionStatement',
            expression: expression
          }
        }

        parent._context.push(expression)
      }
    }
  })

  return newAst;
}

module.exports = {
  traverser,
  transformer
}
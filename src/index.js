export default ({ types: t }) => {
  return {
    visitor: {
      AssignmentExpression(path) {
        let left = path.node.left
        let right = path.node.right
        if (left.type == 'ArrayPattern' && right.type == 'ArrayExpression') {
          if (left.elements.length == 1) {
            let identifier = left.elements[0]
            path.replaceWithMultiple([
              t.variableDeclaration('let', [
                t.VariableDeclarator(t.Identifier(identifier.name), right.elements[0])
              ])
            ])
          } else {
            let identifiers = left.elements
            let headerIdentifiers = identifiers.slice(0, -1)
            let tailIdentifier = identifiers.slice(-1)[0]
            let expressions = headerIdentifiers.map((e, i) => {
              return t.variableDeclaration('let', [
                t.VariableDeclarator(t.Identifier(e.name), right.elements[i])
              ])
            })
            expressions.push(
              t.variableDeclaration('let', [
                t.VariableDeclarator(
                  t.Identifier(tailIdentifier.name),
                  t.ArrayExpression(right.elements.slice(headerIdentifiers.length)))
              ])
            )
            path.replaceWithMultiple(expressions)
          }
          // path.replaceWithMultiple([
          //   t.variableDeclaration('let', [
          //     t.VariableDeclarator(t.Identifier('_head'), right.elements[0])
          //   ]),
          //   t.variableDeclaration('let', [
          //     t.VariableDeclarator(
          //       t.Identifier('_tail'),
          //       t.ArrayExpression(right.elements.slice(1))
          //     )
          //   ])
          // ])
        }
      }
    }
  }
}

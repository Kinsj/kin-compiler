import ASTNode from "./parser/ASTNode";
import ASTNodeType from "./parser/ASTNodeType";

const variables: { [K: string]: number } = {}

const evaluate = (node: ASTNode) => {
  let res: number

  switch (node.nodeType) {
    case ASTNodeType.Programm: {
      node.children.forEach(child => {
        res = evaluate(child)
      })
      break
    }
    case ASTNodeType.Additive: {
      const child1 = node.getChildren()[0]
      const child2 = node.getChildren()[1]
      const value1 = evaluate(child1)
      const value2 = evaluate(child2)
      return node.getText() === '+'
        ? value1 + value2
        : value1 - value2
    }
    case ASTNodeType.Multiplicative: {
      const child1 = node.getChildren()[0]
      const child2 = node.getChildren()[1]
      const value1 = evaluate(child1)
      const value2 = evaluate(child2)
      return node.getText() === '*'
        ? value1 * value2
        : value1 / value2
    }
    case ASTNodeType.IntLiteral:
      return Number(node.getText())
    case ASTNodeType.Identifier: {
      const varName = node.getText()
      if (variables.hasOwnProperty(varName)) {
        return variables[varName]
      } else {
        throw new Error("未定义的变量 " + varName)
      }
    }
    case ASTNodeType.AssignmentStmt:
      let varName = node.getText()
      if (!variables.hasOwnProperty(varName)) {
        throw new Error("未定义的变量 " + varName)
      }   //接着执行下面的代码
    case ASTNodeType.IntDeclaration:
      varName = node.getText()
      let varValue
      // 存在赋值语句，由赋值语句走下来的话一定会有children
      if (node.getChildren().length) {
        const child = node.getChildren()[0]
        varValue = evaluate(child)
      }
      variables[varName] = varValue
      break
    default:
      return undefined
  }
  return res
}

export default evaluate
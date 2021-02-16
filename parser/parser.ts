import { endWithSemi, getIntDeclareToken } from './utils';
import SimpleLexer from "../lexer/simpleLexer";
import SimpleTokenReader from "../lexer/tokenReader";
import TokenType from "../lexer/tokenType";
import ASTNode from './ASTNode'
import ASTNodeType from './ASTNodeType'


class Parser {
  public parse(script: string) {
    // 词法分析
    const tokens = new SimpleLexer().tokenize(script)
    // tokens.dumpAll()
    // 语法分析，生成AST
    return this.prog(tokens)
  }

  private prog(tokens: SimpleTokenReader): ASTNode {
    // 1.创建AST根节点 pwc
    const node = new ASTNode(ASTNodeType.Programm, 'pwc')

    // 遍历tokens，构建AST
    while (tokens.peek() !== null) {
      // 变量声明语句分析
      let child = this.intDeclare(tokens)

      // // 表达式语句分析
      if (!child) {
        child = this.expressionStatement(tokens)
      }

      // 赋值语句分析
      if (!child) {
        child = this.assignmentStatement(tokens)
      }

      // 错误检查
      if (child) {
        node.addChild(child)
      } else {
        throw new Error("未知语句")
      }
    }

    return node
  }

  /**
   * 整型变量声明语句，如：
   * int a
   * int b = 2 * 3
   */
  private intDeclare(tokens: SimpleTokenReader): ASTNode | undefined {
    let node: ASTNode
    let token = getIntDeclareToken(tokens)

    // 测试 是否符合变量声明语法规则: int 变量名
    if (token) {
      // 创建ASTNode
      node = new ASTNode(ASTNodeType.IntDeclaration, token.text)

      // 判断后面是否跟着赋值语句
      if (tokens.peek().type === TokenType.Assignment) {
        tokens.read()  // 取出等号
        const child = this.additive(tokens)
        if (!child) {
          throw new Error('变量初始化错误，= 后面必须是表达式')
        } else {
          node.addChild(child)
        }
      }
    }

    // 语句结束判断
    if(node && !endWithSemi(tokens)) {
      throw new Error('语句缺少 ;')
    }

    return node
  }

  /**
   * 赋值语句
   * @param tokens 
   */
  private assignmentStatement(tokens: SimpleTokenReader): ASTNode | undefined {
    if (tokens.peek()?.type === TokenType.Identifier) {
      let token = tokens.read()
      if (tokens.peek()?.type === TokenType.Assignment) {
        const node = new ASTNode(ASTNodeType.AssignmentStmt, token.text) // 创建赋值变量节点
        tokens.read() // 取出等号
        const child = this.additive(tokens)
        if (child) {
          if (!endWithSemi(tokens)) {
            throw new Error('语句缺少 ;')
          } else {
            node.addChild(child)
            return node
          }
        } else {
          throw new Error('等号后面缺少表达式')
        }
      } else {
        tokens.unread()
      }
    }
  }

  /**
   * 表达式语句
   */
  private expressionStatement(tokens: SimpleTokenReader): ASTNode | undefined {
    const pos = tokens.getPosition() // 记录pos，用于回溯
    // 解析表达式
    const node = this.additive(tokens)
    if (node && !endWithSemi(tokens)) {
      // 语句错误，回溯
      tokens.setPosition(pos)
      return undefined
    }
    return node
  }


  /**
   * 加法表达式
   * @param tokens
   */
  private additive(tokens: SimpleTokenReader): ASTNode | undefined {
    let child1: ASTNode = this.multiplicative(tokens)
    let node = child1
    
    while(true) {
      // token 为 * or /
      if ([TokenType.Plus, TokenType.Minus].indexOf(tokens.peek()?.type) >= 0) {
        const token = tokens.read()
        const child2 = this.multiplicative(tokens)
        if (child2) {
          // 创建一个加法节点并添加两个子节点
          node = new ASTNode(ASTNodeType.Multiplicative, token.text)
          node.addChild(child1)
          node.addChild(child2)
          // 把这个加法节点作为子节点1，带入下次循环继续执行（可能存在 1+2+3+4 这种运算）
          child1 = node
        } else {
          throw new Error('非法的加法表达式，缺少右运算符')
        }
      } else {
        break
      }
    }

    return node
  }

  /**
   * 乘法表达式
   * @param tokens
   */
  private multiplicative(tokens: SimpleTokenReader): ASTNode| undefined {
    let child1: ASTNode = this.primary(tokens)
    let node = child1
    
    while(true) {
      // token 为 * or /
      if ([TokenType.Star, TokenType.Slash].indexOf(tokens.peek()?.type) >= 0) {
        const token = tokens.read()
        const child2 = this.primary(tokens)
        if (child2) {
          // 创建一个乘法节点并添加两个子节点
          node = new ASTNode(ASTNodeType.Multiplicative, token.text)
          node.addChild(child1)
          node.addChild(child2)
          // 把这个乘法节点作为子节点1，带入下次循环继续执行（可能存在 1*2*3*4 这种运算）
          child1 = node
        } else {
          throw new Error('非法的乘法表达式，缺少右运算符')
        }
      } else {
        break
      }
    }

    return node
  }

  /**
   * 基础表达式
   * @param tokens
   */
  private primary(tokens: SimpleTokenReader): ASTNode | undefined {
    let token = tokens.read()  // 读取一个token
    if (token) {
      switch (token.type) {
        // token是个字面量
        case TokenType.IntLiteral: {
          return new ASTNode(ASTNodeType.IntLiteral, token.text)
        }
        // token是个变量
        case TokenType.Identifier: {
          return new ASTNode(ASTNodeType.Identifier, token.text)
        }
        // token是个左括号
        case TokenType.LeftParen: {
          const node = this.additive(tokens)  // 对后面的tokens进行表达式解析
          if (node) {
            if (tokens.read()?.type !== TokenType.RightParen) {
              throw new Error('缺少 )')
            }
            return node
          } else {
            throw new Error('括号内必须有表达式')
          }
        }
        default: {
          return undefined
        }
      }
    }
  }


  /**
   * 输出AST的树状结构
   * @param node
   */
  public dumpAST(node: ASTNode) {
    const dump = (node: ASTNode, indent: string) => {
      console.log(indent + node.getType() + " " + node.getText())
      node.children?.forEach(child => {
        dump(child, indent + '\t')
      })
    }
    dump(node, '')
  }
}

export default Parser
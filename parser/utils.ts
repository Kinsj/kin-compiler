import { SimpleToken } from './../lexer/simpleLexer';
import SimpleTokenReader from "../lexer/tokenReader";
import TokenType from "../lexer/tokenType";

export const endWithSemi = (tokens: SimpleTokenReader) => {
  if (tokens.peek()?.type === TokenType.SemiColon) {
    tokens.read()
    return true
  } else {
    return false
  }
}

export const getIntDeclareToken = (tokens: SimpleTokenReader): SimpleToken | undefined => {
  // 测试 是否符合变量声明语法规则: int 变量名
  if (tokens.peek()?.type === TokenType.Int) {
    // 取出token
    tokens.read()
    if (tokens.peek()?.type === TokenType.Identifier) {
      return tokens.read()
    } else {
      throw new Error('int 后面必须是变量名')
    }
  }
  // 不符合则返回 undefined
}
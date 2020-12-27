import DfaState from './dfaState'
import TokenType from './tokenType'
import { isAlpha, isDigit } from './utils/charType'
// 词法分析
// 目标：分析出以下语句
// age >= 45
// int age = 40
// 2+3*5

class SimpleToken {
  text: string
  type: TokenType
}

// 简易词法分析器
class SimpleLexer {
  private curToken: SimpleToken
  private tokenList: SimpleToken[] = []

  private getInitTokenInfo(ch: string): ([DfaState, TokenType] | void) {
    if (isAlpha(ch)) {              //第一个字符是字母
      if (ch === 'i') {
        return [DfaState.Id_int1, TokenType.Identifier]
      } else {
        return [DfaState.Id, TokenType.Identifier]
      }
    } else if (isDigit(ch)) {       //第一个字符是数字
      return [DfaState.IntLiteral, TokenType.IntLiteral]
    } else if (ch === '>') {         //第一个字符是>
      return [DfaState.GT, TokenType.GT]
    } else if (ch === '+') {
      return [DfaState.Plus, TokenType.Plus]
    } else if (ch === '-') {
      return [DfaState.Minus, TokenType.Minus]

    } else if (ch === '*') {
      return [DfaState.Star, TokenType.Star]

    } else if (ch === '/') {
      return [DfaState.Slash, TokenType.Slash]

    } else if (ch === ';') {
      return [DfaState.SemiColon, TokenType.SemiColon]

    } else if (ch === '(') {
      return [DfaState.LeftParen, TokenType.LeftParen]

    } else if (ch === ')') {
      return [DfaState.RightParen, TokenType.RightParen]

    } else if (ch === '=') {
      return [DfaState.Assignment, TokenType.Assignment]
    }
  }

  // 确定初始状态，保存上一轮结果
  private initToken(ch: string): DfaState {
    // 保存token
    if (this.curToken.text?.length > 0) {
      this.tokenList.push(this.curToken)
      this.curToken = new SimpleToken()
    }

    // 初始化当前token状态
    const [state, type] = this.getInitTokenInfo(ch) || []
    if (state !== undefined && type !== undefined) {
      this.curToken.type = type
      this.curToken.text = ch
      return state
    }

    return DfaState.Initial
  }

  public parse(code: string) {
    this.tokenList = []
    this.curToken = new SimpleToken
    let state: DfaState = DfaState.Initial
    // 遍历字符串
    for (let i = 0; i < code.length; i++) {
      const ch = code[i]
      switch (state) {
        case DfaState.Initial:
          state = this.initToken(ch)
          break;
        case DfaState.Id:
          if (isAlpha(ch) || isDigit(ch)) {
            this.curToken.text += ch
          } else {
            // 不是字符或数字，则保存并重新开始下一个token的计算
            state = this.initToken(ch)
          }
          break;
        case DfaState.GT:
          if (ch === '=') {
            this.curToken.type = TokenType.GE
            this.curToken.text += ch
            state = DfaState.GE
          } else {
            state = this.initToken(ch)
          }
          break;
        case DfaState.GE:
        case DfaState.Assignment:
        case DfaState.Plus:
        case DfaState.Minus:
        case DfaState.Star:
        case DfaState.Slash:
        case DfaState.SemiColon:
        case DfaState.LeftParen:
        case DfaState.RightParen:
          state = this.initToken(ch)
          break;
        case DfaState.IntLiteral:
          if (isDigit(ch)) {
            this.curToken.text += ch
          } else {
            state = this.initToken(ch)
          }
          break;
        case DfaState.Id_int1:
          if (ch === 'n') {
            state = DfaState.Id_int2;
            this.curToken.text += ch
          } else if (isDigit(ch) || isAlpha(ch)) {
            state = DfaState.Id
            this.curToken.text += ch
          } else {
            state = this.initToken(ch)
          }
          break;
        case DfaState.Id_int2:
          if (ch === 't') {
            state = DfaState.Id_int3
            this.curToken.text += ch
          } else if (isDigit(ch) || isAlpha(ch)) {
            state = DfaState.Id
            this.curToken.text += ch
          } else {
            state = this.initToken(ch)
          }
          break;
        case DfaState.Id_int3:
          if (isAlpha(ch) || isDigit(ch)) {
            state = DfaState.Id
            this.curToken.text += ch
          } else {
            this.curToken.type = TokenType.Int
            state = this.initToken(ch)
          }
          break;
        default:
          throw new Error('未知状态')
      }
    }
    if(this.curToken.text.length > 0) {
      this.initToken('')
    }
    return this.tokenList
  }
}

export default SimpleLexer
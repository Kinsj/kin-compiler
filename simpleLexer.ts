import keyworks, { keyworksList, matchKeywords } from './utils/keywords';
import DfaState from './dfaState'
import TokenType from './tokenType'
import { isAlpha, isDigit } from './utils/charType'

class SimpleToken {
  text: string = ''
  type: TokenType
}

// 简易词法分析器
class SimpleLexer {
  private curToken: SimpleToken
  private tokenList: SimpleToken[] = []
  private curKeywordsList = keyworksList

  private getInitTokenInfo(ch: string): ([DfaState, TokenType] | void) {
    if (isAlpha(ch)) {  //第一个字符是字母
      const matchedKeywordsList = matchKeywords(keyworksList, ch)
      // 判断是否有匹配的关键字
      if (matchedKeywordsList.length > 0) {
        // 有则把所有匹配的关键字组成列表，供下次查找
        this.curKeywordsList = matchedKeywordsList
        return [DfaState.Id_Keyword, TokenType.Identifier]
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

  private saveCurToken() {
    this.tokenList.push(this.curToken)
    this.curToken = new SimpleToken()
  }
  private getNewState(ch: string): DfaState {
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
          state = this.getNewState(ch)
          break;
        case DfaState.Id:
          if (isAlpha(ch) || isDigit(ch)) {
            this.curToken.text += ch
          } else {
            // 不是字符或数字，则保存并重新开始下一个token的计算
            this.saveCurToken()
            state = this.getNewState(ch)
          }
          break;
        case DfaState.GT:
          if (ch === '=') {
            this.curToken.type = TokenType.GE
            this.curToken.text += ch
            state = DfaState.GE
          } else {
            this.saveCurToken()
            state = this.getNewState(ch)
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
          this.saveCurToken()
          state = this.getNewState(ch)
          break;
        case DfaState.IntLiteral:
          if (isDigit(ch)) {
            this.curToken.text += ch
          } else {
            this.saveCurToken()
            state = this.getNewState(ch)
          }
          break;
        case DfaState.Id_Keyword:
          // 判断是否是字符或数字，不是则保存关键字，重新计算token
          if (isAlpha(ch) || isDigit(ch)) {
            this.curKeywordsList = matchKeywords(this.curKeywordsList, this.curToken.text + ch)
            // 判断是否依然在关键字列表内
            if (this.curKeywordsList.length > 0) {
              this.curToken.text += ch
            } else {
              state = DfaState.Id
              this.curToken.text += ch
            }
          } else {
            console.log('保存')
            // 保存类型
            this.curToken.type = keyworks[keyworksList[0]]
            // 保存token
            this.saveCurToken()
            state = this.getNewState(ch)
          }
          break;

        default:
          throw new Error('未知状态')
      }
    }
    if (this.curToken.text.length > 0) {
      this.saveCurToken()
    }
    return this.tokenList
  }
}

export default SimpleLexer
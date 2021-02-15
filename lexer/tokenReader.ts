import { SimpleToken } from './simpleLexer';
import TokenType from './tokenType'

class SimpleTokenReader {
  tokens: SimpleToken[]
  pos: number = 0
  constructor(tokens: SimpleToken[]) {
    this.tokens = tokens
  }

  read() {
    if (this.pos < this.tokens.length - 1) {
      return this.tokens[this.pos ++]
    } else {
      return null
    }
  }

  peek() {
    if (this.pos < this.tokens.length - 1) {
      return this.tokens[this.pos]
    } else {
      return null
    }
  }

  unread() {
    this.pos > 0 && this.pos --
  }

  getPosition() {
    return this.pos
  }

  setPosition(position: number) {
    if (position >= 0 && position < this.tokens.length) {
      this.pos = position
    }
  }

  dump() {
    console.log('---------------------')
    this.tokens.slice(this.pos).forEach(token => {
      console.log(`${token.text} :\t ${TokenType[token.type]}`)
    })
  }

  dumpAll() {
    console.log('---------------------')
    this.tokens.forEach(token => {
      console.log(`${token.text} :\t ${TokenType[token.type]}`)
    })
  }
}

export default SimpleTokenReader
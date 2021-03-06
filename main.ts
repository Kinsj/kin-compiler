import SimpleLexer from './lexer/simpleLexer'
import Parser from './parser/parser'

// 词法分析
// 目标：分析出以下语句
// age >= 45
// int age = 40
// 2+3*5
// const lexer = new SimpleLexer
// lexer.tokenize('age >= 45').dumpAll()
// lexer.tokenize('int age = 40').dumpAll()
// lexer.tokenize('2+3*5').dumpAll()

const parser = new Parser()
parser.dumpAST(
  parser.parse(
    ` int age = 45+2;
      age= 20;
      age+10*2;
    `
  )
)
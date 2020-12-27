import SimpleLexer from './simpleLexer'

// 词法分析
const lexer = new SimpleLexer
console.log(lexer.parse('int age = 40'))
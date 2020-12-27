import SimpleLexer from './simpleLexer'

// 词法分析
// 目标：分析出以下语句
// age >= 45
// int age = 40
// 2+3*5
const lexer = new SimpleLexer
console.log(lexer.parse('age >= 45'))
console.log(lexer.parse('int age = 40'))
console.log(lexer.parse('2+3*5'))
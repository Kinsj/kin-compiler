import SimpleLexer from './lexer/simpleLexer'

// 词法分析
// 目标：分析出以下语句
// age >= 45
// int age = 40
// 2+3*5
const lexer = new SimpleLexer
console.log(lexer.tokenize('age >= 45').dumpAll())
console.log(lexer.tokenize('int age = 40').dumpAll())
console.log(lexer.tokenize('2+3*5').dumpAll())
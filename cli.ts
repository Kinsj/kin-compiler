import Parser from "./parser/parser";

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

const parser = new Parser()
rl.prompt();
rl.on('line', (line) => {
  if (line === 'exit()') {
    rl.close()
  }
  parser.dumpAST(
    parser.parse(line)
  )
  rl.prompt();
}).on('close', () => {
  console.log('再见!');
  process.exit(0);
});
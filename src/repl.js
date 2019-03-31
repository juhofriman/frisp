const readline = require('readline');
const parser = require('./parser');
const e = require('./evaluator');
const scope = require('./scope');
var pjson = require('../package.json');

const rootScope = scope();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('close', () => {
  console.log();
  console.log('Bye!');
});

function prompt() {
  rl.question('jsisp> ', (cmd) => {
    const res = e(parser.parseString(cmd), rootScope);
    console.log(res);
    prompt();
  });
}

function intro() {
  console.log(`THE JSISP REPL <${pjson.version}>`);
  console.log();
}

intro();
prompt();

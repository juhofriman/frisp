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

    rl.question('frisp> ', (cmd) => {
      try {
        if(cmd.startsWith('tokenize ')) {
          console.log(parser.tokenize(cmd.substring('tokenize '.length)));
        } else if(cmd.startsWith('parse ')) {
          console.log(JSON.stringify(parser.parseString(cmd.substring('parse '.length)), null, 2));
        } else {
          const res = e(parser.parseString(cmd), rootScope);
          console.log(res);
        }
      } catch(err) {
        console.log(err);
      }


    prompt();
  });
}

function intro() {
  console.log(`THE FRISP REPL <${pjson.version}>`);
  console.log();
}

intro();
prompt();

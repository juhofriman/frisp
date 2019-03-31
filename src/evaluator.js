const scope = require('./scope');


function lookup(currentScope, ref) {
  if(Array.isArray(ref)) {
    return evaluate([ref]);
  }
  if(ref.type === 'value') {
    return ref.value;
  }
  if(ref.type === 'symbol') {
    if(ref.value.startsWith('*')) {
      return ref.value.substring(1);
    }
    switch(ref.value) {
     case 'def': return (name, value) => {
       console.log(name + ' -> ' + value);
       currentScope.register(name, value);
     };
     case '+': return (a, b, c, d) => {
       if(!b && !c && !d) {
         return a;
       }
       if(!c && !d) {
         return a + b;
       }
       if(!d) {
         return a + b + c;
       }
       return a + b + c + d;
     };
     default: return currentScope.resolve(ref.value)

    }
  }

}

function evaluate(p, currentScope) {
  if(!currentScope) {
      currentScope = scope();
  }
  const results  = p.map(line => {
    const [first, ...rest] = line.map((line) => lookup(currentScope, line));
    return first.apply(this, rest);
  });

  return results[results.length - 1];
}

module.exports = evaluate;

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
    if(!Array.isArray(line)) {
      if(line.type === 'symbol') {
        return currentScope.resolve(line.value);
      } else {
        return line.value;
      }
    }
    if(line[0].type === 'symbol' && line[0].value === 'def') {
      if(Array.isArray(line[2])) {
        currentScope.register(line[1].value, line[2]);
      } else {
        currentScope.register(line[1].value, line[2].value);
      }

      return null;
    }
    if(line[0].type === 'symbol' && line[0].value === 'fn') {
      return (args) => {
        console.log(args);
        const fnScope = currentScope.child();
        line[1].forEach((b, i) => {
          fnScope.register(b.value, args);
        });
        return evaluate([line[2], args], fnScope);
      };
    }
    const [first, ...rest] = line.map((line) => lookup(currentScope, line));
    return first.apply(this, rest);
  });

  return results[results.length - 1];
}

module.exports = evaluate;

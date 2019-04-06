const scope = require('./scope');

function paired(arr) {
  const d = [];
  for(var i = 0; i < arr.length; i = i + 2) {
    d.push([arr[i], arr[i + 1] ? arr[i + 1] : null]);
  }
  return d;
}

function lookup(currentScope, ref) {

  if(Array.isArray(ref)) {
    return evaluate([ref], currentScope);
  }

  if(ref.type === 'value') {
    return ref.value;
  }

  if(ref.type === 'symbol') {
    switch(ref.value) {
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
     case 'even?': return (a) => a % 2 === 0;
     case 'inc': return (a) => a + 1;
     case 'map': return (pred, arr) => arr.map(pred);
     case 'filter': return (pred, arr) => arr.filter(pred);
     case 'reduce': return (pred, arr) => arr.reduce(pred);
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
        currentScope.register(line[1].value, evaluate([line[2]], currentScope));
      } else {
        currentScope.register(line[1].value, line[2].value);
      }

      return line[1].value;
    }
    if(line[0].type === 'symbol' && line[0].value === 'fn') {
      return (...args) => {
        const fnScope = currentScope.child();
        line[1].forEach((b, i) => {
          fnScope.register(b.value, args[i]);
        });
        return evaluate([line[2]], fnScope);
      };
    }
    if(line[0].type === 'symbol' && line[0].value === 'let') {
      const letScope = currentScope.child();
      paired(line[1]).forEach(([ref, value]) => {
        if(Array.isArray(value)) {
          letScope.register(ref.value, evaluate([value], currentScope));
        } else {
          letScope.register(ref.value, value.value);
        }
      });
      return evaluate([line[2]], letScope);

    }

    const x = line.map((line) => lookup(currentScope, line));
    if(line[0].quoted) {
      return x;
    }
    const [first, ...rest] = x;

    return first.apply(this, rest);

  });

  return results[results.length - 1];
}

module.exports = evaluate;

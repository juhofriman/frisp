function scope(parent) {
  const vals = {};

  const me = {
    echo: () => {
      for(k in vals) {
        console.log(`${k} -> ${vals[k]}`);
      }
    },
    register: (symbol, value) => {
      // console.log(`${symbol} -> ${value}`);
      vals[symbol] = value;
    },
    resolve: (symbol) => {
      if(vals[symbol] === undefined) {
        if(!parent) {
          throw new Error('No such symbol in scope: ' + symbol);
        }
        return parent.resolve(symbol);

      }
      return vals[symbol];
    },
    child: () => {
      return scope(me);
    }
  };

  return me;
}

module.exports = scope;

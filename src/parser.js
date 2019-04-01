function paired(arr) {
  const d = [];
  for(var i = 0; i < arr.length; i++) {
    d.push([arr[i], arr[i + 1] ? arr[i + 1] : null]);
  }
  return d;
}

function sliceParens(arr) {
  if(arr[0] !== '(') {
    throw new Error('Invalid popping position: ' + arr);
  }
  const collector = [];
  let rest = null;
  let balance = 0;
  for(var i = 1; i < arr.length; i++) {
    if(arr[i] === '(') {
      balance++;
    }
    if(arr[i] === ')') {
      if(balance === 0) {
        rest = arr.slice(i + 1);
        break;
      } else {
        balance--;
      }
    }
    collector.push(arr[i]);
  }

  return [collector, rest];
}


function tokenize(source) {
  const characters = paired(source.split(''));
  const tokenized = [];
  let collector = '';
  characters.forEach(([character, next]) => {
    if(character === ' ') {
      return;
    }
    if(character === '(' || character === ')') {
      tokenized.push(character);
      collector = '';
      return;
    }
    collector += character;
    if(next === ')' || next === ' ') {
      const tInt = parseInt(collector);
      if(Number.isInteger(tInt)) {
        tokenized.push({type: 'value', value: tInt});
      } else {
        tokenized.push({type: 'symbol', value: collector});
      }

      collector = '';
    }
  });
  if(collector.length > 0) {
      const tInt = parseInt(collector);
      if(Number.isInteger(tInt)) {
        tokenized.push({type: 'value', value: tInt});
      } else {
        tokenized.push({type: 'symbol', value: collector});
      }
  }
  return tokenized;
}

function parseRecursion(collector, rest) {
  if(!rest || rest.length === 0) {
    return collector;
  }

  if(rest[0] === '(') {
    const [sub, restInThis] = sliceParens(rest);
    collector.push(parseRecursion([], sub))
    return parseRecursion(collector, restInThis);
  } else if(rest[0] === ')') {
    return collector;
  }

  collector.push(rest[0]);
  return parseRecursion(collector, rest.slice(1));

}

function parse(tokenStream) {
  return parseRecursion([], tokenStream);
}

module.exports = {
  parseString: (str) => parse(tokenize(str)),
  parse: parse,
  tokenize: tokenize,
  paired: paired,
  sliceParens: sliceParens
};

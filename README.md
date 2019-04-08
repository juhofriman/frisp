# FRISP-LANG

Frisp is a from scratch made LISP evalutor built on top of Javascript. It has zero runtime dependencies and `jest` is used for running unit tests. I have an idea of making frisp runnable on browser as well.

Frisp is a LISP intepreter, it does not (at least currently) transpile to javascript.

## Running

Clone repository and

```
npm install
npm test
npm run repl
```

## Using REPL

```
THE FRISP REPL <0.0.1>

frisp> (+ 1 1)
2
frisp> (def a 1)
a
frisp> (+ a 5)
6
frisp> (def add-five (fn (a) (+ a 5))
add-five
frisp> (add-five 5)
10
frisp> (let (a 100) (add-five a))
105
frisp> (map inc '(1 2 3 4))
[ 2, 3, 4, 5 ]
frisp> (def fibonacci (fn (c acc p1 p2) (if (zero? c) acc (let (next (+ p1 p2)) (fibonacci (dec c) (cons acc next) next p1)))))
fibonacci
frisp> (fibonacci 10 '() 1 0)
[ 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 ]
```

## What's included

No docs yet ;)

`+, -, zero?, map, let, cons...`
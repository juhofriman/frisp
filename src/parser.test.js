const parser = require('./parser');

describe('parser.js', () => {

  describe('paired', () => {
    it('Should pair', () => {
      expect(parser.paired([1, 2, 3, 4])).toEqual([[1, 2], [2, 3], [3, 4], [4, null]])
    });
  });

  describe('sliceParens', () => {
    it('Should slice parens', () => {
      expect(parser.sliceParens(['(', '+', '1', '1', ')']))
        .toEqual([['+', '1', '1'], []]);
      expect(parser.sliceParens(['(', '+', '(', '+', '1', '1', ')', '1', ')']))
        .toEqual([['+', '(', '+', '1', '1', ')', '1'], []]);
      expect(parser.sliceParens(['(', '+', '1', '1', ')', '1'], '(+ 1 1) 1')).toEqual([['+', '1', '1'], ['1']]);
    });
  });

  describe('tokenize', () => {
    it('should tokenize correctly', () => {
      // this should work as well, important for REPL
      expect(parser.tokenize('x')).toEqual([{ type: 'symbol', value: 'x' }]);
      expect(parser.tokenize('42')).toEqual([{ type: 'value', value: 42 }]);
      expect(parser.tokenize('()')).toEqual(['(', ')']);
      expect(parser.tokenize('(foo)')).toEqual(['(', { type: 'symbol', value: 'foo' }, ')']);
      expect(parser.tokenize('(foo bar)')).toEqual(['(', { type: 'symbol', value: 'foo' }, { type: 'symbol', value: 'bar' }, ')']);
      expect(parser.tokenize('(foo (+ 1 1) bar)'))
        .toEqual(['(', { type: 'symbol', value: 'foo' }, '(', { type: 'symbol', value: '+' }, { type: 'value', value: 1 }, { type: 'value', value: 1 }, ')', { type: 'symbol', value: 'bar' }, ')']);
      // expect(parser.tokenize('(foo (+ 1 1) bar)'))
      //   .toEqual(['(', 'foo', '(', '+', '1', '1', ')', 'bar', ')']);
    });
  });

  describe('parser', () => {
      it('Should parse simple LISP', () => {

        expect(parser.parse(parser.tokenize('(+ 1 1)')))
          .toEqual([
            [
              {type: 'symbol', value: '+'},
              {type: 'value', value: 1},
              {type: 'value', value: 1}
            ]
          ]);

        expect(parser.parse(parser.tokenize('(+ 1 (+ 1 1) 1)')))
          .toEqual([
            [
              {type: 'symbol', value: '+'},
              {type: 'value', value: 1},
              [
                {type: 'symbol', value: '+'},
                {type: 'value', value: 1},
                {type: 'value', value: 1}
              ],
              {type: 'value', value: 1}
            ]
          ]);
      });
  });
});

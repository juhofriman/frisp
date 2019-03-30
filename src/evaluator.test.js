const evaluate = require('./evaluator');

describe('evaluator.js', () => {
  it('Should evaluate simple program and resolve scope', () => {
    /*
    ; This is special form
    (def *x 1)
    (+ x x)
    */
    expect(evaluate([
      [
        {type: 'symbol', value: 'def'},
        {type: 'symbol', value: '*x'},
        {type: 'value', value: 1}
      ],
      [
        {type: 'symbol', value: '+'},
        {type: 'symbol', value: 'x'},
        {type: 'symbol', value: 'x'}
      ]
    ])).toEqual(2);
  });

    it('Should evaluate recursively', () => {
      /*
      (+ 1 1 (+ 1 1))
      */
      expect(evaluate([
        [
          {type: 'symbol', value: '+'},
          {type: 'value', value: 1},
          {type: 'value', value: 1},
          [
            {type: 'symbol', value: '+'},
            {type: 'value', value: 1},
            {type: 'value', value: 1},
          ]
        ]
      ])).toEqual(4);
      /*
      (+ 1 1 (+ 1 1) (+ 1 1))
      */
      expect(evaluate([
        [
          {type: 'symbol', value: '+'},
          {type: 'value', value: 1},
          {type: 'value', value: 1},
          [
            {type: 'symbol', value: '+'},
            {type: 'value', value: 1},
            {type: 'value', value: 1},
          ],
          [
            {type: 'symbol', value: '+'},
            {type: 'value', value: 1},
            {type: 'value', value: 1},
          ],
        ]
      ])).toEqual(6);
    });
});

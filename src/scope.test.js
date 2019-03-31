const scope = require('./scope');

describe('scope.js', () => {
  it('Should resolve registered values', () => {
    const s = scope();
    s.register('bar', 'baz');
    expect(s.resolve('bar')).toEqual('baz');
  });
  it('Should throw for non existing symbol', () => {
    const s = scope();
    expect(() => s.resolve('bar')).toThrow();
  });
  it('Should support child scope', () => {
    const parent = scope();
    const child = parent.child();
    parent.register('foo', 'foz');
    child.register('bar', 'baz');
    expect(child.resolve('bar')).toEqual('baz');
    expect(child.resolve('foo')).toEqual('foz');
    expect(parent.resolve('foo')).toEqual('foz');
    expect(() => parent.resolve('bar')).toThrow();
  });
});

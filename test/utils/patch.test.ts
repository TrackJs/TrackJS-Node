import { patch, unpatch } from '../../src/utils/patch'

describe('patch(obj, name, func)', () => {

  test('replaces original function', () => {
    var func = jest.fn();
    var obj = { func };
    patch(obj, 'func', function() {
      return function() {};
    });
    expect(obj.func).not.toBe(func);
  });

  test('creates new function', () => {
    var obj = {};
    patch(obj, 'func2', function() {
      return function() {};
    });
    expect(obj['func2']).toBeDefined();
  });

  test('calls through with original function', () => {
    var func = jest.fn();
    var obj = { func };
    patch(obj, 'func', function(original) {
      return function() {
        original.apply(this, arguments);
      };
    });
    obj.func('a', 'b');
    expect(func).toHaveBeenCalledWith('a', 'b');
  });

});

describe('unpatch(obj, name)', () => {

  test('restores a patched function to original', () => {
    var func = jest.fn();
    var obj = { func };
    patch(obj, 'func', (original) => function() { return original(); });
    expect(obj.func).not.toBe(func);
    unpatch(obj, 'func');
    expect(obj.func).toBe(func);
  });

});


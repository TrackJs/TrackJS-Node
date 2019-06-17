import { Metadata } from '../src/Metadata';

describe('Metadata', () => {

  describe('constructor', () => {

    test('creates empty', () => {
      var m = new Metadata();
      expect(m.get()).toEqual([]);
    })

    test('creates with initialValues', () => {
      var m = new Metadata({ 'foo': 'bar' });
      expect(m.get()).toEqual([{
        key: 'foo',
        value: 'bar'
      }]);
    })

  });

  test('adds values', () => {
    var m = new Metadata();
    m.add('foo', 'bar');
    expect(m.get()).toEqual([{
      key: 'foo',
      value: 'bar'
    }]);
  })

  test('overwrites values', () => {
    var m = new Metadata();
    m.add('foo', 'bar');
    m.add('foo', 'baz');
    expect(m.get()).toEqual([{
      key: 'foo',
      value: 'baz'
    }]);
  })

  test('adds multiple values', () => {
    var m = new Metadata();
    m.add('foo', 'bar');
    m.add({
      'foo': 'baz',
      'bar': 'baz'
    });
    expect(m.get()).toEqual([
      { key: 'foo', value: 'baz' },
      { key: 'bar', value: 'baz' }
    ]);
  })

  test('adds non-string values', () => {
    var m = new Metadata();
    m.add({
      4: { foo: "bar" } as unknown as string
    });
    expect(m.get()).toEqual([{
      key: '4', value: '{\"foo\":\"bar\"}'
    }]);
  })

})

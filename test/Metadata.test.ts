import { Metadata } from '../src/Metadata';

describe('Metadata', () => {

  describe('constructor()', () => {
    it('creates empty', () => {
      let m = new Metadata();
      expect(m.get()).toEqual([]);
    })
    it('creates with initial values', () => {
      let m = new Metadata({ 'foo': 'bar' });
      expect(m.get()).toEqual([{
        key: 'foo',
        value: 'bar'
      }]);
    })
  });

  describe('clone()', () => {
    it('has equal values', () => {
      let meta1 = new Metadata({ 'foo': 'bar' });
      let meta2 = meta1.clone();
      expect(meta1.get()).toEqual(meta2.get());
      expect(meta1.get()).not.toBe(meta2.get());
    });
    it('can be changed separately', () => {
      let meta1 = new Metadata({ 'foo': 'bar' });
      let meta2 = meta1.clone();
      meta2.add('bar', 'baz');
      expect(meta1.get()).not.toEqual(meta2.get());
    });
  });

  describe('add(), remove(), get()',() => {
    it('adds values', () => {
      let m = new Metadata();
      m.add('foo', 'bar');
      expect(m.get()).toEqual([{
        key: 'foo',
        value: 'bar'
      }]);
    })
    it('overwrites values', () => {
      let m = new Metadata();
      m.add('foo', 'bar');
      m.add('foo', 'baz');
      expect(m.get()).toEqual([{
        key: 'foo',
        value: 'baz'
      }]);
    })
    it('adds multiple values', () => {
      let m = new Metadata();
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
    it('adds non-string values', () => {
      let m = new Metadata();
      m.add({
        4: { foo: "bar" } as unknown as string
      });
      expect(m.get()).toEqual([{
        key: '4', value: '{\"foo\":\"bar\"}'
      }]);
    })
    it('removes values', () => {
      let m = new Metadata();
      m.add('foo', 'bar');
      m.remove('foo');
      expect(m.get()).toEqual([]);
    })
    it('removes multiple values', () => {
      let m = new Metadata();
      m.add('foo', 'bar');
      m.add('bar', 'bar');
      m.add('baz', 'bar');
      m.remove({
        'foo': '',
        'baz': ''
      });
      expect(m.get()).toEqual([{ key: 'bar', value: 'bar' }]);
    })
  });

});

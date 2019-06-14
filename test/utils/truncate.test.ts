import truncate from "../../src/utils/truncate";

describe('truncate()', () => {

  test('returns strings shorter then length unchanged', () => {
    expect(truncate('a normal string', 15)).toBe('a normal string');
  });

  test('appends ellipsis and length to long string', () => {
    expect(truncate('a too long string', 5)).toBe('a too...{12}');
  });

});

import { truncateString } from "../../src/utils/truncateString";

describe('truncateString()', () => {

  test('returns strings shorter then length unchanged', () => {
    expect(truncateString('a normal string', 15)).toBe('a normal string');
  });

  test('appends ellipsis and length to long string', () => {
    expect(truncateString('a too long string', 5)).toBe('a too...{12}');
  });

});

/**
 * Truncate a string at a specified length and append ellipsis with a count
 * of truncated characters. e.g. "this string was too...{12}".
 *
 * @param {String} str String to truncate
 * @param {Number} length Maximum string length
 * @return {String} truncated string.
 */
export function truncateString(value: string, length: number): string {
  if (value.length <= length) {
    return value;
  }
  var truncatedLength = value.length - length;
  return value.substr(0, length) + "...{" + truncatedLength + "}";
}

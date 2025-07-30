/**
 * Deletes characters from a string to make it a fancy string.
 * @param {string} s - The input string.
 * @returns {string} - The resulting fancy string.
 */
function makeFancyString(s: string): string {
  const result: string[] = [];
  for (const char of s) {
    if (
      result.length >= 2 &&
      result[result.length - 1] === result[result.length - 2] &&
      char === result[result.length - 1]
    )
      continue;
    result.push(char);
  }
  return result.join('');
}

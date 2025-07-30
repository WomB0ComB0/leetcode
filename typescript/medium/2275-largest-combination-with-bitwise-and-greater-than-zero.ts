/**
 * Finds the largest combination of bitwise AND greater than zero.
 * @param {number[]} candidates - The list of integers to find the largest combination of bitwise AND greater than zero.
 * @return {number} - The largest combination of bitwise AND greater than zero.
 */
function largestCombination(candidates: number[]): number {
  return Math.max(
    ...Array.from({ length: 32 }, (_, i) => sum(candidates.map((x) => (x >> i) & 1))),
  );
}

/**
 * Sums the elements of an array.
 *
 * @param {number[]} arr - The array of numbers to sum.
 * @return {number} - The sum of the array elements.
 */
const sum = (arr: number[]): number => arr.reduce((acc, curr) => acc + curr, 0);

/**
 * Asserts that the expected and actual values are equal.
 * @param {any} expected - The expected value.
 * @param {any} actual - The actual value.
 */
const assert = (expected: any, actual: any): void => {
  if (typeof expected !== typeof actual) {
    throw new Error(
      `Type mismatch: Expected type ${typeof expected} but got type ${typeof actual}`,
    );
  }
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) {
      throw new Error(
        `Array length mismatch: Expected length ${expected.length} but got length ${actual.length}`,
      );
    }
    for (let i = 0; i < expected.length; i++) {
      if (expected[i] !== actual[i]) {
        throw new Error(
          `Array element mismatch at index ${i}: Expected ${expected[i]} but got ${actual[i]}`,
        );
      }
    }
  } else if (expected !== actual) {
    throw new Error(`Expected ${expected} but got ${actual}`);
  }
};

if (require.main === module) {
  assert(4, largestCombination([16, 17, 71, 62, 12, 24, 14]));
  assert(4, largestCombination([8, 8, 8, 8]));
  assert(1, largestCombination([1, 2, 4, 8, 16]));
  assert(4, largestCombination([31, 31, 31, 31]));
  assert(0, largestCombination([0, 0, 0, 0]));
}

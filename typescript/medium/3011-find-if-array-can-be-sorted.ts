/**
 * Extends the Number interface to include a bitCount method.
 */
declare global {
  interface Number {
    /**
     * Returns the number of 1-bits in the binary representation of the number.
     * @return {number} The number of 1-bits.
     */
    bitCount(): number;
  }
}

/**
 * Adds the bitCount method to the Number prototype.
 * @return {number} The number of 1-bits in the binary representation of the number.
 */
Number.prototype.bitCount = function () {
  return this.toString(2).split('0').join('').length;
};

/**
 * Converts a comparison function into a key function for sorting.
 * @param {function(number, number): number} cmp - The comparison function.
 * @return {function(number, number): number} The key function for sorting.
 */
const cmp_to_key = (cmp: (a: number, b: number) => number) => {
  return (a: number, b: number) => {
    const result = cmp(a, b);
    // Ensure we return -1, 0, or 1 for stable sorting
    return result < 0 ? -1 : result > 0 ? 1 : 0;
  };
};

/**
 * Determines if the given array can be sorted based on a custom comparison function.
 * The custom comparison function sorts numbers primarily by the number of 1-bits in their binary representation.
 * If two numbers have the same number of 1-bits, they are sorted by their natural order.
 * @param {number[]} nums - The list of integers to be sorted.
 * @return {boolean} True if the array can be sorted in non-decreasing order using the custom comparison function, False otherwise.
 */
function canSortArray(nums: number[]): boolean {
  const cmp = (a: number, b: number): number => {
    const aBits = a.bitCount();
    const bBits = b.bitCount();
    if (aBits === bBits) {
      return a - b;
    }
    return Number(aBits > bBits);
  };

  const sorted = [...nums].sort(cmp_to_key(cmp));

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1] > sorted[i]) {
      return false;
    }
  }
  return true;
}

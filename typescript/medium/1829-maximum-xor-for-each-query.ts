/**
 * Get the maximum XOR values for each query.
 * @param {number[]} nums - The list of numbers.
 * @param {number} maximumBit - The maximum bit length of the numbers in the list.
 * @returns {number[]} The list of maximum XOR values.
 */
function getMaximumXor(nums: number[], maximumBit: number): number[] {
  /**
   * Accumulate a list of numbers using a function.
   * @param {number[]} arr - The list of numbers to be accumulated.
   * @returns {number[]} The accumulated list of numbers.
   */
  const accumulate = (arr: number[]): number[] => {
    const result: number[] = [arr[0]];
    for (let i = 1; i < arr.length; i++) result.push(result[i - 1] ^ arr[i]);
    return result;
  };

  const mask: number = (1 << maximumBit) - 1;
  return accumulate(nums)
    .map((num) => num ^ mask)
    .reverse();
}

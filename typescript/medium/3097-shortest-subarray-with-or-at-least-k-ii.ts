/**
 * Finds the shortest subarray with OR at least K.
 * @param {number[]} nums - The array of numbers.
 * @param {number} k - The minimum OR value.
 * @returns {number} - The length of the shortest subarray with OR at least K.
 */
function minimumSubarrayLength(nums: number[], k: number): number {
  /**
   * Syntax:
   * |= is the bitwise OR operator.
   *
   * Example:
   * 0010 |= 0100 = 0110
   *
   * 1 << i is the left shift operator.
   *
   * Example:
   * 1 << 2 = 000100
   *
   * & is the bitwise AND operator.
   *
   * Example:
   * 0110 & 0010 = 0010
   *
   * ^ is the bitwise XOR operator.
   *
   * Example:
   * 0110 ^ 0010 = 0100
   */

  const n: number = nums.length,
    bits: number[] = new Array(32).fill(0);

  let ans: number = Number.MAX_VALUE,
    window_val = 0,
    l = 0;

  for (let r = 0; r < n; r++) {
    // update window value
    window_val |= nums[r];
    // update bits
    for (let i = 0; i < 32; i++) {
      // if the bit is set, increment the count
      if ((1 << i) & nums[r]) bits[i] += 1;
    }

    // shrink the window from the left
    while (l <= r && window_val >= k) {
      ans = Math.min(ans, r - l + 1);
      // update bits
      for (let i = 0; i < 32; i++) {
        // if the bit is set, decrement the count
        if ((1 << i) & nums[l]) {
          bits[i] -= 1;
          // if the count is 0, update the window value
          if (bits[i] === 0) window_val = window_val ^ (1 << i);
        }
      }
      // move the left pointer to the right
      l += 1;
    }
  }
  // if no subarray is found, return -1
  return ans === Number.MAX_VALUE ? -1 : ans;
}

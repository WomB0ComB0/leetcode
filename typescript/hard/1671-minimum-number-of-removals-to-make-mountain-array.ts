/**
 * Finds the minimum number of removals to make a mountain array.
 * @param nums - The input list of integers.
 * @type {number[]} nums - The input list of integers.
 * @returns {number} - The minimum number of removals to make a mountain array.
 */
function minimumMountainRemovals(nums: number[]): number {
  const n: number = nums.length;

  /**
   * Calculates the length of the longest increasing subsequence (LIS) for a given array.
   * @param arr - The input array of integers.
   * @type {number[]} arr - The input array of integers.
   * @returns {number[]} - The length of the longest increasing subsequence for each element in the array.
   */
  const calculateLIS = (arr: number[]): number[] => {
    // Initialize the list to store the length of the longest increasing subsequence for each element.
    const lisLength: number[] = new Array(arr.length).fill(0);
    // Initialize the sequence list to store the elements of the longest increasing subsequence.
    const seq: number[] = [];
    for (const [i, num] of arr.entries()) {
      // Find the position to insert the current number in the sequence.
      const pos: number = bisectLeft(seq, num);
      if (pos === seq.length) {
        // If the number is greater than all elements in the sequence, append it.
        seq.push(num);
      } else {
        // If the number is not greater than all elements in the sequence, replace the existing number.
        seq[pos] = num;
      }
      // Update the length of the longest increasing subsequence for the current element.
      lisLength[i] = pos + 1;
    }
    return lisLength;
  };

  // Calculate the LIS for the original array and its reverse.
  const leftLIS: number[] = calculateLIS(nums);
  const rightLIS: number[] = calculateLIS(nums.reverse()).reverse();

  // Initialize the minimum number of removals to a large value.
  let minRemovals: number = Number.POSITIVE_INFINITY;

  // Iterate through the array to find the minimum number of removals.
  for (let i = 1; i < n - 1; i++) {
    if (leftLIS[i] > 1 && rightLIS[i] > 1) {
      // Calculate the number of removals needed to form a mountain array.
      const currentRemovals: number = n - (leftLIS[i] + rightLIS[i] - 1);
      // Update the minimum number of removals if the current number is smaller.
      minRemovals = Math.min(minRemovals, currentRemovals);
    }
  }
  return minRemovals;
}

/**
 * Finds the leftmost position to insert a value in a sorted array.
 * @param arr - The input array of integers.
 * @param x - The value to insert.
 * @type {number[]} arr - The input array of integers.
 * @type {number} x - The value to insert.
 * @returns {number} - The leftmost position to insert the value.
 */
const bisectLeft = (arr: number[], x: number): number => {
  let lo = 0;
  let hi: number = arr.length;
  while (lo < hi) {
    const mid: number = Math.floor((lo + hi) / 2);
    if (arr[mid] < x) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
};

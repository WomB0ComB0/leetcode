/**
 * Finds the longest square streak in an array.
 *
 * @param {number[]} nums - The input array of numbers.
 * @returns {number} - The length of the longest square streak, or -1 if there is no streak.
 */
export function longestSquareStreak(nums: number[]): number {
  // Create a map to store the count of each number's square
  const count: Map<number, number> = new Map();
  // Iterate through the sorted numbers and update the count of each number's square
  for (const x of nums.sort((a, b) => a - b)) {
    count.set(x * x, (count.get(x) || 0) + 1);
  }
  // Find the maximum count of any number's square
  const res: number = Math.max(...Array.from(count.values()));
  // Return the result, or -1 if the maximum count is less than 2
  return res >= 2 ? res : -1;
}

/**
 * Given two strings s and goal, return true if and only if s can become goal after some number of shifts on s.
 * @param {string} s
 * @param {string} goal
 * @return {boolean}
 *
 */
function rotateString(s: string, goal: string): boolean {
  /**
   * s.length === goal.length: Check if the lengths of s and goal are equal
   * (s + s).includes(goal): Check if goal is a substring of s concatenated with itself
   */
  return s.length === goal.length && (s + s).includes(goal);
}

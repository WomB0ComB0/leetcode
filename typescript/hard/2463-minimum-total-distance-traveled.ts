/**
 * Finds the minimum total distance traveled by robots to factories.
 * @param {number[]} robot - The list of robot positions.
 * @param {number[][]} factory - The list of factory positions and limits.
 * @returns {number} - The minimum total distance traveled.
 */
function minimumTotalDistance(robot: number[], factory: number[][]): number {
  // Sort robots and factories
  robot.sort((a, b) => a - b);
  factory.sort((a, b) => a[0] - b[0]);

  // Create memoization map
  const memo = new Map<string, number>();

  function dp(robotIdx: number, factoryIdx: number, used: number): number {
    // Base cases
    if (robotIdx === robot.length) return 0;
    if (factoryIdx === factory.length) return 1e15;

    // Create key for memoization
    const key = `${robotIdx},${factoryIdx},${used}`;
    if (memo.has(key)) return memo.get(key)!;

    // Try not using current factory
    let best = dp(robotIdx, factoryIdx + 1, 0);

    // Try using current factory if capacity allows
    if (used < factory[factoryIdx][1]) {
      const cost = Math.abs(robot[robotIdx] - factory[factoryIdx][0]);
      best = Math.min(best, dp(robotIdx + 1, factoryIdx, used + 1) + cost);
    }

    memo.set(key, best);
    return best;
  }

  return dp(0, 0, 0);
}

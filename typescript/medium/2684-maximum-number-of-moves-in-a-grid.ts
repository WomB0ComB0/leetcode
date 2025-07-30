/**
 * Finds the maximum number of moves in a grid.
 *
 * @param {number[][]} grid - The input grid of integers.
 * @returns {number} - The maximum number of moves.
 */
function maxMoves(grid: number[][]): number {
  // If the grid is empty, return 0 as there are no moves possible.
  if (grid.length === 0) return 0;

  // Get the number of rows and columns in the grid.
  const rows: number = grid.length,
    cols: number = grid[0].length,
    // Initialize a 2D array to store the maximum number of moves from each cell.
    dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  /**
   * Helper function to calculate the maximum number of moves from a given cell.
   *
   * @param {number[][]} grid - The input grid of integers.
   * @param {number} ri - The row index of the current cell.
   * @param {number} cj - The column index of the current cell.
   * @returns {number} - The maximum number of moves from the current cell.
   */
  const helper = (grid: number[][], ri: number, cj: number): number => {
    // Define the possible directions to move in the grid.
    const directions: number[][] = [
      [ri - 1, cj + 1], // Move to the top-right cell.
      [ri, cj + 1], // Move to the right cell.
      [ri + 1, cj + 1], // Move to the bottom-right cell.
    ];
    let maxMoves = 0;

    // Iterate through each possible direction.
    for (const [dr, dc] of directions) {
      // Check if the new cell is within the grid bounds and has a greater value.
      if (dr >= 0 && dr < rows && dc >= 0 && dc < cols && grid[dr][dc] > grid[ri][cj]) {
        // Update the maxMoves.
        maxMoves = Math.max(maxMoves, dp[dr][dc] + 1);
      }
    }
    return maxMoves;
  };

  // Fill the dp array by calculating the maximum number of moves from each cell.
  for (let j = cols - 1; j >= 0; j--) {
    for (let i = 0; i < rows; i++) {
      dp[i][j] = helper(grid, i, j);
    }
  }

  // Return the maximum number of moves found starting from any cell in the first column.
  return Math.max(...dp.map((row) => row[0]));
}

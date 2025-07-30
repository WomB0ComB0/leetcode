/**
 * Counts the number of square submatrices with all ones.
 *
 * @param {number[][]} matrix - The input matrix of 0s and 1s.
 * @returns {number} - The total number of square submatrices with all ones.
 */
export function countSquares(matrix: number[][]): number {
  // If the matrix is empty, return 0
  if (matrix.length === 0) return 0;

  // Get the number of rows and columns in the matrix
  const rows: number = matrix.length,
    cols: number = matrix[0].length;

  // Initialize a 2D array to store the size of the largest square submatrix ending at each cell
  const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Initialize the total number of square submatrices
  let total_squares = 0;

  // Iterate through each cell in the matrix
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // If the current cell contains a 1
      if (matrix[i][j] === 1) {
        // If the cell is in the first row or first column, it can only form a square of size 1
        if (i === 0 || j === 0) {
          dp[i][j] = 1;
        } else {
          // Otherwise, the size of the square submatrix ending at this cell is determined by the minimum size of the squares ending at the top, left, and top-left neighbors plus 1
          dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        }
        // Add the size of the square submatrix ending at this cell to the total count
        total_squares += dp[i][j];
      }
    }
  }
  // Return the total number of square submatrices
  return total_squares;
}

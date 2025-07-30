from typing import List


class Solution:
    def countSquares(self, matrix: List[List[int]]) -> int:
        if not matrix:
            return 0

        # Get the number of rows and columns in the matrix
        (rows, cols) = (len(matrix), len(matrix[0]))

        # Initialize a 2D list to store the number of squares ending at each cell
        dp: List[List[int]] = [[0] * cols for _ in range(rows)]

        # Initialize the total number of squares
        total_squares: int = 0

        # Iterate through each cell in the matrix
        for i in range(rows):
            for j in range(cols):
                # If the current cell contains a 1
                if matrix[i][j] == 1:
                    # If it's in the first row or first column, it can only form a square of size 1
                    if i == 0 or j == 0:
                        dp[i][j] = 1
                    else:
                        # Otherwise, it can form a square with the minimum number of squares from its top, left, and top-left neighbors plus 1
                        dp[i][j] = min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
                    # Add the number of squares ending at the current cell to the total count
                    total_squares += dp[i][j]
        # Return the total number of squares
        return total_squares

from typing import List, Tuple


class Solution:
    def maxMoves(self, grid: List[List[int]]) -> int:
        """
        Finds the maximum number of moves in a grid.

        Args:
          grid (List[List[int]]): The input grid of integers.

        Returns:
          int: The maximum number of moves.
        """
        if not grid:
            return 0

        rows, cols = len(grid), len(grid[0])
        dp = [[0] * cols for _ in range(rows)]

        def helper(grid: List[List[int]], ri: int, cj: int) -> int:
            """
            Helper function to calculate the maximum number of moves from a given cell.

            Args:
              grid (List[List[int]]): The input grid of integers.
              ri (int): The row index of the current cell.
              cj (int): The column index of the current cell.

            Returns:
              int: The maximum number of moves from the current cell.
            """
            directions: List[Tuple[int, int]] = [
                (ri - 1, cj + 1),  # Move to the top-right cell.
                (ri, cj + 1),  # Move to the right cell.
                (ri + 1, cj + 1),  # Move to the bottom-right cell.
            ]
            max_moves = 0

            for dr, dc in directions:
                if 0 <= dr < rows and 0 <= dc < cols and grid[dr][dc] > grid[ri][cj]:
                    max_moves = max(max_moves, dp[dr][dc] + 1)

            return max_moves

        for j in range(cols - 1, -1, -1):
            for i in range(rows):
                dp[i][j] = helper(grid, i, j)

        return max(dp[i][0] for i in range(rows))

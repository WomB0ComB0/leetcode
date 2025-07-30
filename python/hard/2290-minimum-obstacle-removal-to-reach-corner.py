import heapq
from typing import List
from math import inf


class Solution:
    def minimumObstacles(self, grid: List[List[int]]) -> int:
        """
        Finds the minimum number of obstacles that need to be removed to reach the bottom-right corner of a grid.

        Uses Dijkstra's algorithm with a min heap to find the shortest path from top-left to bottom-right,
        where the weight of each edge is the value in the grid cell (0 for empty cell, 1 for obstacle).

        Time Complexity: O(RC * log(RC)) where R is number of rows and C is number of columns
        Space Complexity: O(RC) for the cache and heap

        Args:
            grid (List[List[int]]): A binary matrix where 0 represents empty cell and 1 represents obstacle
                                   grid[i][j] is either 0 or 1
                                   1 <= grid.length, grid[0].length <= 10^5

        Returns:
            int: Minimum number of obstacles that must be removed to create a path from (0,0) to (R-1,C-1)
                 Returns -1 if no path exists

        Example:
            >>> minimumObstacles([[0,1,1],[1,1,0],[1,1,0]])
            2
            # Must remove 2 obstacles to create path: (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2)
        """
        R, C = len(grid), len(grid[0])
        cache = [[inf] * C for _ in range(R)]
        cache[0][0] = grid[0][0]
        heap = [(grid[0][0], 0, 0)]

        while heap:
            w, r, c = heapq.heappop(heap)
            if r == R - 1 and c == C - 1:
                return w + grid[-1][-1]

            for nr, nc in [(r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)]:
                if (0 <= nr < R) and (0 <= nc < C) and w < cache[nr][nc]:
                    cache[nr][nc] = w
                    heapq.heappush(heap, (w + grid[nr][nc], nr, nc))
        return -1

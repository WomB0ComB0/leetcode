from typing import List


class Solution:
    def luckyNumbers(self, matrix: List[List[int]]) -> List[int]:
        min_in_rows = {min(row) for row in matrix}

        max_in_cols = {max(col) for col in zip(*matrix)}

        lucky_numbers = list(min_in_rows & max_in_cols)

        return lucky_numbers

from typing import List


class Solution:
    def numberOfAlternatingGroups(self, colors: List[int]) -> int:
        def isAlternating(left: int, mid: int, right: int) -> bool:
            return (left == 1 and mid == 0 and right == 1) or (
                left == 0 and mid == 1 and right == 0
            )

        n = len(colors)
        groups = 0

        for i in range(n):
            left = colors[i]
            mid = colors[(i + 1) % n]
            right = colors[(i + 2) % n]
            if isAlternating(left, mid, right):
                groups += 1

        return groups

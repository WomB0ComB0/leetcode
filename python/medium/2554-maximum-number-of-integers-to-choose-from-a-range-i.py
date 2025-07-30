from typing import Set, List


class Solution:
    def maxCount(self, banned: List[int], n: int, maxSum: int) -> int:
        b: Set[int] = set(banned)
        (acc, res, i) = (0, 0, 1)
        while acc < maxSum and i <= n:
            if i in b:
                i += 1
            else:
                acc += i
                i += 1
                res += 1
        return res if acc <= maxSum else res - 1

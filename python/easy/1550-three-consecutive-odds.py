from typing import List


class Solution:
    def threeConsecutiveOdds(self, arr: List[int]) -> bool:
        left = 0
        right = 2
        while right < len(arr):
            window = list(filter(lambda x: x % 2 != 0, arr[left : right + 1]))
            if len(window) == 3:
                return True
            left += 1
            right += 1
        return False

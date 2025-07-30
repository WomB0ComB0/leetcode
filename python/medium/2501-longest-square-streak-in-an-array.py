from collections import Counter
from typing import List


class Solution:
    def longestSquareStreak(self, nums: List[int]) -> int:
        """
        Finds the longest square streak in an array.

        Args:
          nums (List[int]): The input array of numbers.

        Returns:
          int: The length of the longest square streak, or -1 if there is no streak.
        """
        # Create a counter to store the count of each number's square
        count: Counter[int, int] = Counter()
        # Iterate through the sorted numbers and update the count of each number's square
        for x in sorted(nums):
            count[x * x] = count[x] + 1
        # Find the maximum count of any number's square
        res: int = max(count.values())
        # Return the result, or -1 if the maximum count is less than 2
        return res if res >= 2 else -1

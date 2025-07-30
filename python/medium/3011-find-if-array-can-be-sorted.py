from typing import List
from functools import cmp_to_key


class Solution:
    def canSortArray(self, nums: List[int]) -> bool:
        """
        Determines if the given array can be sorted based on a custom comparison function.

        The custom comparison function sorts numbers primarily by the number of 1-bits in their binary representation.
        If two numbers have the same number of 1-bits, they are sorted by their natural order.

        Args:
        nums (List[int]): The list of integers to be sorted.

        Returns:
        bool: True if the array can be sorted in non-decreasing order using the custom comparison function, False otherwise.
        """

        def cmp(a, b):
            """
            Custom comparison function for sorting.

            Args:
            a (int): The first integer to compare.
            b (int): The second integer to compare.

            Returns:
            int: Negative if a < b, zero if a == b, positive if a > b.
            """
            if a.bit_count() == b.bit_count():
                return a - b
            return a > b

        # cmp_to_key is a function that takes a comparison function and returns a key function
        nums.sort(key=cmp_to_key(cmp))
        for i in range(1, len(nums)):
            if nums[i - 1] > nums[i]:
                return False
        return True

from bisect import bisect_left
from typing import List
from math import inf


class Solution:
    def minimumMountainRemovals(self, nums: List[int]) -> int:
        """
        Finds the minimum number of removals to make a mountain array.

        Args:
          nums (List[int]): The input list of integers.

        Returns:
          int: The minimum number of removals to make a mountain array.
        """
        n: int = len(nums)

        def calculate_lis(arr: List[int]) -> List[int]:
            """
            Calculates the length of the longest increasing subsequence (LIS) for a given array.

            Args:
              arr (List[int]): The input array of integers.

            Returns:
              List[int]: The length of the longest increasing subsequence for each element in the array.
            """
            # Initialize the list to store the length of the longest increasing subsequence for each element.
            lis_length: List[int] = [0] * len(arr)
            # Initialize the sequence list to store the elements of the longest increasing subsequence.
            seq: List[int] = []
            for i, num in enumerate(arr):
                # Find the position to insert the current number in the sequence.
                pos: int = bisect_left(seq, num)
                if pos == len(seq):
                    # If the number is greater than all elements in the sequence, append it.
                    seq.append(num)
                else:
                    # If the number is not greater than all elements in the sequence, replace the existing number.
                    seq[pos] = num
                # Update the length of the longest increasing subsequence for the current element.
                lis_length[i] = pos + 1
            return lis_length

        # Calculate the LIS for the original array and its reverse.
        left_lis: List[int] = calculate_lis(nums)
        right_lis: List[int] = calculate_lis(nums[::-1])[::-1]

        # Initialize the minimum number of removals to a large value.
        min_removals: int = inf

        # Iterate through the array to find the minimum number of removals.
        for i in range(1, n - 1):
            if left_lis[i] > 1 and right_lis[i] > 1:
                # Calculate the number of removals needed to form a mountain array.
                current_removals: int = n - (left_lis[i] + right_lis[i] - 1)
                # Update the minimum number of removals if the current number is smaller.
                min_removals = min(min_removals, current_removals)

        return min_removals

from typing import List


class Solution:
    def minimumSubarrayLength(self, nums: List[int], k: int) -> int:
        """
        Finds the shortest subarray with OR at least K.

        Args:
          nums (List[int]): The array of numbers.
          k (int): The minimum OR value.

        Returns:
          int: The length of the shortest subarray with OR at least K.
        """
        n: int = len(nums)
        ans: int = int(1e10)
        window_val: int = 0
        l: int = 0
        bits: List[int] = [0] * 32

        for r in range(n):
            # update window value
            window_val |= nums[r]
            # update bits
            for i in range(32):
                if (1 << i) & nums[r]:
                    bits[i] += 1

            # shrink the window from the left
            while l <= r and window_val >= k:
                ans = min(ans, r - l + 1)
                # update bits
                for i in range(32):
                    # if the bit is set, decrement the count
                    if (1 << i) & nums[l]:
                        bits[i] -= 1
                        if bits[i] == 0:
                            window_val = window_val ^ (1 << i)
                l += 1
        # if no subarray is found, return -1
        return -1 if ans == int(1e10) else ans

from typing import List


class Solution:
    def sortJumbled(self, mapping: List[int], nums: List[int]) -> List[int]:
        # Convert original numbers to their mapped values
        new_nums: List[int] = []
        nums_str: List[str] = [str(x) for x in nums]

        for num in nums_str:
            new_str: List[str] = []
            for c in num:
                new_str.append(str(mapping[int(c)]))
            new_nums.append("".join(new_str))
        new_nums = [int(x) for x in new_nums]

        # Create a list of tuples: (mapped value, original index, original number)
        sorted_nums: List[tuple] = []
        N: int = len(new_nums)
        for i in range(N):
            sorted_nums.append((new_nums[i], i, nums[i]))

        # Sort based on mapped values, then by original index
        sorted_nums.sort()

        # Return the original numbers in the new sorted order
        return [x[2] for x in sorted_nums]

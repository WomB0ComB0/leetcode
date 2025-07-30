from itertools import accumulate
from operator import xor
from functools import partial
from typing import List


class Solution:
    def getMaximumXor(self, nums: List[int], maximumBit: int) -> List[int]:
        """
        Args:
            nums (List[int]): The list of numbers.
            maximumBit (int): The maximum bit length of the numbers in the list.

        Returns:
            List[int]: The result list of maximum XOR values.
        """
        return [*map(partial(xor, (1 << maximumBit) - 1), list(accumulate(nums, xor)))][
            ::-1
        ]

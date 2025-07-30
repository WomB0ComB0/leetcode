from collections import Counter
from typing import List


class Solution:
    def kthDistinct(self, arr: List[str], k: int) -> str:
        counter: Counter = Counter(arr)

        res: List[str] = [element for element in arr if counter[element] == 1]

        if k <= len(res):
            return res[k - 1]
        else:
            return ""

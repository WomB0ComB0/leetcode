from typing import List
from heapq import heapify, heappop, heappush
from math import floor


class Solution:
    def pickGifts(self, gifts: List[int], k: int) -> int:
        h = [-x for x in gifts]
        heapify(h)
        for _ in range(k):
            x = -heappop(h)
            heappush(h, -int(floor(x**0.5)))
        return abs(sum(h))

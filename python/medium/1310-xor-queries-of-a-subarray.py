from typing import List
from itertools import accumulate


class Solution:
    def xorQueries(self, arr: List[int], queries: List[List[int]]) -> List[int]:
        # prefix XOR
        """
        arr = [0] + arr
        for i in range(1, len(arr)):
            arr[i] = arr[i-1] ^ arr[i]
        return [arr[e+1] ^ arr[i] for i, e in queries]
        """
        xors = [0] + list(accumulate(arr, lambda x, y: x ^ y))
        """
        arr = [1, 3, 4, 8]
        xors = [0, 1, 4, 8, 16]
        queries = [[0, 1], [1, 2], [0, 3], [3, 3]]
        res = [xors[1+1] ^ xors[0] = 4 ^ 0 = 4
                xors[2+1] ^ xors[1] = 8 ^ 1 = 7
                xors[4+1] ^ xors[0] = 16 ^ 0 = 16
                xors[4+1] ^ xors[3] = 16 ^ 8 = 8
                ]
        res = [4, 7, 16, 8]
        """
        return [xors[e + 1] ^ xors[i] for i, e in queries]

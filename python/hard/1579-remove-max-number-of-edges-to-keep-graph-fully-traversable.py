from typing import List

from typing import List


class DSU:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def unite(self, x: int, y: int) -> bool:
        x, y = self.find(x), self.find(y)
        if x == y:
            return False
        if self.size[x] < self.size[y]:
            x, y = y, x
        self.parent[y] = x
        self.size[x] += self.size[y]
        return True

    def get_size(self, x: int) -> int:
        return self.size[self.find(x)]


class Solution:
    def maxNumEdgesToRemove(self, n: int, edges: List[List[int]]) -> int:
        dsu = DSU(n + 1), DSU(n + 1)
        res = len(edges)
        for t, i, j in edges:
            res -= t == 3 and dsu[0].unite(i, j) and dsu[1].unite(i, j)

        for t, i, j in edges:
            res -= t < 3 and dsu[t - 1].unite(i, j)
        if dsu[0].get_size(1) < n or dsu[1].get_size(1) < n:
            return -1
        return res

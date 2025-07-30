from typing import List, Tuple
import heapq
from math import inf


class Solution:
    def findTheCity(
        self, n: int, edges: List[List[int]], distanceThreshold: int
    ) -> int:
        """
        Input: n cities, edges, distanceThreshold

        [0]---5---[1]
        | \       |
        |  \      |
        6   2     1
        |    \    |
        |     \   |
        [3]---4---[2]

        Build graph:
        [0] -> [(1,5), (2,2), (3,6)]
        [1] -> [(0,5), (2,1)]
        [2] -> [(0,2), (1,1), (3,4)]
        [3] -> [(0,6), (2,4)]

        For each city (0 to n-1):
        a. Run Dijkstra's algorithm
        b. Count reachable cities within threshold

        City 0:  [0, 5, 2, 6]  Reachable: 3
        City 1:  [5, 0, 1, 5]  Reachable: 3
        City 2:  [2, 1, 0, 4]  Reachable: 4
        City 3:  [6, 5, 4, 0]  Reachable: 3

        Find city with minimum reachable cities
        (if tie, choose larger city number)

        Output: City 3
        """
        graph: List[List[Tuple[int, int]]] = [[] for _ in range(n)]
        for u, v, w in edges:
            graph[u].append((v, w))
            graph[v].append((u, w))

        min_reachable: int = inf
        min_city: int = -1

        for u in range(n):
            reachable: int = sum(
                1 for d in self.dijkstra(u, graph) if d <= distanceThreshold
            )
            if reachable < min_reachable or (
                reachable == min_reachable and u > min_city
            ):
                min_reachable = reachable
                min_city = u

        return min_city

    def dijkstra(self, start: int, graph: List[List[Tuple[int, int]]]) -> List[int]:
        """
        Input: start node, graph
        Output: distances from start node to all other nodes
        """
        heap: List[Tuple[int, int]] = [(0, start)]
        distances: List[int] = [inf] * len(graph)
        distances[start] = 0

        while heap:
            d, u = heapq.heappop(heap)
            if d > distances[u]:
                continue
            for v, w in graph[u]:
                d2 = d + w
                if distances[v] > d2:
                    distances[v] = d2
                    heapq.heappush(heap, (d2, v))

        return distances

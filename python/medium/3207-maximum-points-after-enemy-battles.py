from typing import List
import heapq


class Solution:
    def maximumPoints(self, enemyEnergies: List[int], currentEnergy: int) -> int:
        enemyEnergies.sort()
        points = 0
        min_heap = []

        for energy in enemyEnergies:
            if currentEnergy >= energy:
                currentEnergy -= energy
                points += 1
                heapq.heappush(min_heap, energy)
            elif points > 0 and min_heap:
                weakest_enemy = heapq.heappop(min_heap)
                currentEnergy += weakest_enemy
                points -= 1
                if currentEnergy >= energy:
                    currentEnergy -= energy
                    points += 1
                    heapq.heappush(min_heap, energy)
                else:
                    currentEnergy -= weakest_enemy
                    heapq.heappush(min_heap, weakest_enemy)
                    break
            else:
                break
        return points


if __name__ == "__main__":
    solution = Solution()
    print(solution.maximumPoints([2], 10))

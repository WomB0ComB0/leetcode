from typing import List


class Solution:
    def survivedRobotsHealths(
        self, positions: List[int], healths: List[int], directions: str
    ) -> List[int]:
        N: int = len(positions)
        robots = sorted(zip(positions, healths, directions, range(N)))
        stack = []

        for pos, health, direction, i in robots:
            if direction == "R":
                stack.append((pos, health, direction, i))
            else:
                while stack and stack[-1][2] == "R" and stack[-1][1] < health:
                    stack.pop()
                    health -= 1
                if stack and stack[-1][2] == "R" and stack[-1][1] == health:
                    stack.pop()
                else:
                    if stack and stack[-1][2] == "R":
                        stack[-1] = (
                            stack[-1][0],
                            stack[-1][1] - 1,
                            stack[-1][2],
                            stack[-1][3],
                        )
                    else:
                        stack.append((pos, health, direction, i))
        res = [
            (pos, health, direction, i)
            for pos, health, direction, i in stack
            if health > 0
        ]
        res.sort(key=lambda x: x[3])

        result = [0] * N
        for pos, health, direction, i in res:
            result[i] = health
        return [health for health in result if health > 0]

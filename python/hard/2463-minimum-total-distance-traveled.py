from typing import List
from functools import lru_cache


class Solution:
    def minimumTotalDistance(self, robot: List[int], factory: List[List[int]]) -> int:
        """
        Finds the minimum total distance traveled by robots to factories.

        Args:
          robot (List[int]): The list of robot positions.
          factory (List[List[int]]): The list of factory positions and limits.

        Returns:
          int: The minimum total distance traveled.
        """
        robot.sort()
        factory.sort(key=lambda x: x[0])

        @lru_cache(None)
        def dp(robot_idx: int, factory_idx: int, used: int) -> int:
            """
            Args:
              robot_idx (int): The index of the robot to assign.
              factory_idx (int): The index of the factory to assign to.
              used (int): The number of robots already assigned to the current factory.

            Returns:
              int: The minimum total distance traveled.
            """
            # If all robots are assigned, we're done
            if robot_idx == len(robot):
                return 0
            # If no more factories but robots remain, invalid
            if factory_idx == len(factory):
                return 10**15

            # Try not using current factory
            best = dp(robot_idx, factory_idx + 1, 0)

            # Try using current factory if capacity allows
            if used < factory[factory_idx][1]:
                cost = abs(robot[robot_idx] - factory[factory_idx][0])
                best = min(best, dp(robot_idx + 1, factory_idx, used + 1) + cost)

            return best

        return dp(0, 0, 0)

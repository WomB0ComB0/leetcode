class Solution:
    def rotateString(self, s: str, goal: str) -> bool:
        """
        Given two strings s and goal, return true if and only if s can become goal after some number of shifts on s.

        Args:
          s (str): The string to rotate
          goal (str): The goal string to check if s can become after some number of shifts

        Returns:
          bool: True if s can become goal after some number of shifts, False otherwise
        """
        # If the lengths of s and goal are not equal, s cannot become goal after any number of shifts
        if len(s) != len(goal):
            return False
        n: int = len(s)
        # Check if s can become goal after some number of shifts
        while n >= 1:
            if s == goal:
                return True
            # Rotate s by moving the last character to the front
            s = s[-1] + s[:-1]
            n -= 1
        return False

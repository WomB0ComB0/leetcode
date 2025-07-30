class Solution:
    def makeFancyString(self, s: str) -> str:
        """
        Deletes characters from a string to make it a fancy string.

        Args:
          s (str): The input string.

        Returns:
          str: The resulting fancy string.
        """
        result = []
        for char in s:
            if len(result) >= 2 and result[-1] == result[-2] == char:
                continue
            result.append(char)
        return "".join(result)

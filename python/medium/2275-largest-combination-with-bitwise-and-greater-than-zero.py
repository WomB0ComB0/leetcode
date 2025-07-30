from typing import List


class Solution:
    def largestCombination(self, candidates: List[int]) -> int:
        """
        Finds the largest combination of bitwise AND greater than zero.

        Args:
          candidates (List[int]): The list of integers to find the largest combination of bitwise AND greater than zero.

        Returns:
            int: The largest combination of bitwise AND greater than zero.
        """
        # Iterate through each bit position (0 to 31)
        # and sum the number of candidates that have a 1 in that bit position
        return max(sum(x >> i & 1 for x in candidates) for i in range(32))


if __name__ == "__main__":
    solution = Solution()
    # Test case 1
    candidates1 = [16, 17, 71, 62, 12, 24, 14]
    assert (
        solution.largestCombination(candidates1) == 4
    ), f"Test case 1 failed: {solution.largestCombination(candidates1)}"

    # Test case 2
    candidates2 = [8, 8, 8, 8]
    assert (
        solution.largestCombination(candidates2) == 4
    ), f"Test case 2 failed: {solution.largestCombination(candidates2)}"

    # Test case 3
    candidates3 = [1, 2, 4, 8, 16]
    assert (
        solution.largestCombination(candidates3) == 1
    ), f"Test case 3 failed: {solution.largestCombination(candidates3)}"

    # Test case 4
    candidates4 = [31, 31, 31, 31]
    assert (
        solution.largestCombination(candidates4) == 4
    ), f"Test case 4 failed: {solution.largestCombination(candidates4)}"

    # Test case 5
    candidates5 = [0, 0, 0, 0]
    assert (
        solution.largestCombination(candidates5) == 0
    ), f"Test case 5 failed: {solution.largestCombination(candidates5)}"

    print("All test cases passed!")

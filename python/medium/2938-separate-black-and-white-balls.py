class Solution:
    """
    Given a binary string s, you can swap any two positions in the string.
    Return the minimum number of swaps needed to group all 1's present in the string together in any location.
    """

    def minimumSteps(self, s: str) -> int:
        t: int = 0  # number of 1's in the string
        swaps: int = 0  # number of swaps needed
        # iterate over the string in reverse
        for i, c in enumerate(s[::-1]):
            if c == "1":
                # if the number of 1's in the string is not equal to the index,
                # then we need to swap the current 1 with the previous 1
                if t != i:
                    swaps += i - t

                t += 1

        return swaps

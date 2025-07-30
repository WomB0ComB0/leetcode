from operator import ne


class Solution:
    def minChanges(self, s: str) -> int:
        """
        Given a binary string s, return the minimum number of changes needed to make s beautiful.
        A binary string is beautiful if no two adjacent characters are the same.

        The function works by splitting the string into two parts:
        - Characters at even indices
        - Characters at odd indices

        It then uses the `map` function with the `ne` (not equal) operator to compare corresponding characters
        from the two parts. The `ne` operator returns 1 if the characters are not equal, otherwise it returns 0.

        Finally, the `sum` function is used to sum up the results of the `map` function, which gives the minimum
        number of changes needed to make the binary string beautiful.

        :param s: The input binary string.
        :return: The minimum number of changes needed to make the binary string beautiful.
        """
        return sum(map(ne, s[::2], s[1::2]))

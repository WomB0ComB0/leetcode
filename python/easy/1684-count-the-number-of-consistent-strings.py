from typing import List


class Solution:
    def countConsistentStrings(self, allowed: str, words: List[str]) -> int:
        # convert allowed to a set for O(1) lookup
        allowed_set = set(allowed)
        # count the number of words that are consistent
        return sum(all(char in allowed_set for char in word) for word in words)

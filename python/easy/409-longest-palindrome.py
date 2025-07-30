from collections import Counter


class SolutionlongestPalindrome:
    def longestPalindrome(self, s: str) -> int:
        counter = Counter(s)
        length = 0
        odd_exists = False
        for count in counter.values():
            if count % 2 == 0:
                length += count
            else:
                length += count - 1
                odd_exists = True
        if odd_exists:
            length += 1
        return length

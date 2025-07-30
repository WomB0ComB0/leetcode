class Solution:
    def findTheLongestSubstring(self, s: str) -> int:
        # seen = [-1, None, None, None, None, None]
        seen = [-1] + [None] * 31
        # current is 0, max_so_far is 0
        cur, msf = 0, 0
        # keep track  of indices of the first occurence of the current state
        for i, c in enumerate(s):
            # if c is a vowel
            if c in "aeiou":
                # cur = cur XOR 1 shifted to the left by the index of c in 'aeiou'
                # cur = cur XOR 1 << 'aeiou'.index(c)
                cur ^= 1 << "aeiou".index(c)
            if seen[cur] is not None:
                # max_so_far = max(max_so_far, i - seen[cur])
                msf = max(msf, i - seen[cur])
            else:
                # seen[cur] = i
                seen[cur] = i
        return msf

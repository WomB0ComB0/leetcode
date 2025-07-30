class Solution:
    def shortestPalindrome(self, s: str) -> str:
        def z_function(S):
            n = len(S)
            Z = [0] * n
            l = r = 0
            for i in range(1, n):
                z = Z[i - l]
                if i + z >= r:
                    z = max(r - i, 0)
                    while i + z < n and S[z] == S[i + z]:
                        z += 1
                    l, r = i, i + z
                Z[i] = z
            Z[0] = n
            return Z

        z = z_function(s + "$" + s[::-1])[len(s) + 1 :]
        rs = s[::-1]
        for i, x in enumerate(z):
            if x + i == len(s):
                pre = rs[:i]
                palin = rs[i:]
                return pre + palin + pre[::-1]

        return s[::-1] + s

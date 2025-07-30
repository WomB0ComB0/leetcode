from typing import List


class Solution:
    def validStrings(self, n: int) -> List[str]:
        result: List[str] = []

        def generate(current: str):
            if len(current) == n:
                result.append(current)
                return
            if not current or current[-1] == "1":
                generate(current + "0")
            generate(current + "1")

        generate("")
        i: int = 0
        while i < len(result):
            string: str = result[i]
            for j in range(len(string) - 1):
                if string[j : j + 2] == "00":
                    result.pop(i)
                    i -= 1
                    break
            i += 1

        return result


# def subsets2(list1: List[int]) -> List[List[int]]:
#     return [[]] + [list1[:i] + s for i in range(1, len(list1)) for s in subsets2(tuple(list1[i:]))]

print(Solution().validStrings(1))

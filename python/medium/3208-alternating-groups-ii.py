from typing import List


class Solution:
    def numberOfAlternatingGroups(self, colors: List[int], k: int) -> int:
        n = len(colors)
        if k > n:
            return 0

        alternating_pairs = sum(colors[i] != colors[i + 1] for i in range(k - 1))
        count = 1 if alternating_pairs == k - 1 else 0

        for start in range(1, n):
            end = (start + k - 1) % n
            prev_end = (start + k - 2) % n

            if colors[start - 1] != colors[start % n]:
                alternating_pairs -= 1

            if colors[prev_end] != colors[end]:
                alternating_pairs += 1

            if alternating_pairs == k - 1:
                count += 1

        return count


if __name__ == "__main__":
    solution = Solution()
    print(solution.numberOfAlternatingGroups([0, 1, 0, 0, 1, 0, 1], 6))
    print(solution.numberOfAlternatingGroups([0, 1, 0, 1, 0], 3))

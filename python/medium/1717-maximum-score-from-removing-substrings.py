from typing import List


class Solution:
    def maximumGain(self, s: str, x: int, y: int) -> int:
        g: List[str] = (
            ["a", "b"] if x > y else ["b", "a"]
        )  # Determine the order of removal
        p: List[int] = sorted([x, y])  # Sort scores to use the higher score first
        res: int = 0  # Initialize the result score
        for _ in range(2):  # Two passes: one for each substring
            t: List[str] = []  # Temporary list to build the new string
            for c in s:
                t.append(c)  # Add character to the list
                if (
                    t[-2:] == g
                ):  # Check if the last two characters match the prioritized substring
                    del t[-2:]  # Remove the matched substring
                    res += p[1]  # Add the corresponding score to the result
            s = "".join(t)  # Convert list back to string for the next pass
            g = g[::-1]  # Reverse the order of the substring
            p = p[::-1]  # Reverse the order of the scores
        return res  # Return the total score


def main() -> None:
    s: str = "cdbcbbaaabab"
    x: int = 4
    y: int = 5
    print(Solution().maximumGain(s, x, y))

    s: str = "aabbaaxybbaabb"
    x: int = 5
    y: int = 4
    print(Solution().maximumGain(s, x, y))


if __name__ == "__main__":
    main()

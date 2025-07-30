from typing import List


class Solution:
    def reverseParentheses(self, s: str) -> str:
        stack: List[str] = []
        # iterate over the string
        for char in s:
            # we want to get the characters between the parentheses
            if char == ")":
                temp: List[str] = []
                # pop the stack until we get to the '('
                # we want to reverse the characters between the parentheses
                while stack and stack[-1] != "(":
                    temp.append(stack.pop())
                stack.pop()  # Remove the '('
                # add the characters between the parentheses to the stack
                stack.extend(temp)
            else:
                # add the characters to the stack
                stack.append(char)
        return "".join(stack)


# Example usage:
def main() -> None:
    solution = Solution()
    print(solution.reverseParentheses("(abcd)"))  # Output: "dcba"
    print(solution.reverseParentheses("(u(love)i)"))  # Output: "iloveu"
    print(solution.reverseParentheses("(ed(et(oc))el)"))  # Output: "leetcode"


if __name__ == "__main__":
    main()

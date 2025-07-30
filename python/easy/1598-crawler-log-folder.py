from typing import List


class Solution:
    def minOperations(self, logs: List[str]) -> int:
        stack: List[str] = []
        for log in logs:
            # Checking if the log is a back to parent folder
            match log:
                case "../":
                    if stack:
                        stack.pop()
                case "./":
                    continue
                case _:
                    stack.append(log)
        return len(stack)

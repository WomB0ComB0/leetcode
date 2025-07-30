class Solution:
    def parseBoolExpr(self, expression: str) -> bool:
        operands = {
            "|": lambda x, y: x or y,
            "&": lambda x, y: x and y,
            "!": lambda x, y: not x,
        }

        match = lambda c: True if c == "t" else (False if c == "f" else "(")

        ops = []
        booleans = []
        for c in expression:
            if c in operands:
                ops.append(c)

            elif c == ")":
                res = booleans[-1]
                booleans.pop()

                operand = ops.pop()
                while booleans[-1] != "(":
                    res = operands[operand](res, booleans.pop())

                booleans.pop()
                booleans.append(operands[operand](res, res))

            elif c != ",":
                booleans.append(match(c))

        return booleans[-1]

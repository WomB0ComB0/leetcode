from typing import Optional


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def getDirections(
        self, root: Optional[TreeNode], startValue: int, destValue: int
    ) -> str:
        parents = {}
        start = None

        def go(node, p):
            if node is None:
                return
            nonlocal start
            if node.val == startValue:
                start = node
            parents[node] = p
            go(node.left, node)
            go(node.right, node)

        go(root, None)

        def find(node, p, cur):
            if node is None:
                return ""
            if node.val == destValue:
                return "".join(cur)
            if parents[node] != p:
                cur.append("U")
                ans_here = find(parents[node], node, cur)
                if ans_here != "":
                    return ans_here
                cur.pop()
            if node.left != p:
                cur.append("L")
                ans_here = find(node.left, node, cur)
                if ans_here != "":
                    return ans_here
                cur.pop()
            if node.right != p:
                cur.append("R")
                ans_here = find(node.right, node, cur)
                if ans_here != "":
                    return ans_here
                cur.pop()
            return ""

        return find(start, None, [])

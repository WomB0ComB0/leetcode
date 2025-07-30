from collections import defaultdict
from typing import Optional, List


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def treeQueries(self, root: Optional[TreeNode], queries: List[int]) -> List[int]:
        Depth, Height = defaultdict(int), defaultdict(int)

        def dfs(node, depth):
            if not node:
                return -1

            Depth[node.val] = depth
            cur = max(dfs(node.left, depth + 1), dfs(node.right, depth + 1)) + 1
            Height[node.val] = cur
            return cur

        dfs(root, 0)

        cousins = defaultdict(list)
        for val, depth in Depth.items():
            cousins[depth].append((-Height[val], val))
            cousins[depth].sort()
            if len(cousins[depth]) > 2:
                cousins[depth].pop()

        ans = []
        for q in queries:
            depth = Depth[q]
            if len(cousins[depth]) == 1:
                ans.append(depth - 1)
            elif cousins[depth][0][1] == q:
                ans.append(-cousins[depth][1][0] + depth)
            else:
                ans.append(-cousins[depth][0][0] + depth)
        return ans

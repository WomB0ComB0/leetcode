from typing import Optional, List


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def createBinaryTree(self, descriptions: List[List[int]]) -> Optional[TreeNode]:
        dsu = DSU()
        for parent, child, is_left in descriptions:
            dsu.union(parent, child, is_left)
        return dsu.find(descriptions[0][0])


class DSU:
    def __init__(self):
        self.parent = {}
        self.nodes = {}

    def find(self, val):
        if val == self.parent[val].val:
            return self.parent[val]
        self.parent[val] = self.find(self.parent[val].val)
        return self.parent[val]

    def union(self, parent, child, is_left):
        for val in parent, child:
            if val not in self.nodes:
                self.parent[val] = self.nodes[val] = TreeNode(val)
        if is_left:
            self.nodes[parent].left = self.nodes[child]
        else:
            self.nodes[parent].right = self.nodes[child]
        self.parent[self.find(child).val] = self.find(parent)

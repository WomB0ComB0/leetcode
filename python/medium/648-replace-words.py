from typing import List


class TrieNode:
    def __init__(self):
        self.children = {}
        self.last = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, str) -> None:
        curr = self.root
        for c in str:
            if c not in curr.children:
                curr.children[c] = TrieNode()
            curr = curr.children[c]
        curr.last = True

    def find(self, str) -> int:
        root = ""
        curr = self.root
        for i, c in enumerate(str):
            if c in curr.children:
                root += c
                curr = curr.children[c]
                if curr.last == True:
                    return (True, root)
            else:
                return (False, "")
        return (True, root)


class Solution:
    def replaceWords(self, dictionary: List[str], sentence: str) -> str:
        book = Trie()
        for word in dictionary:
            book.insert(word)
        arr = sentence.split(" ")
        for i, deriv in enumerate(arr):
            check = book.find(deriv)
            if check[0]:
                arr[i] = check[1]
        return " ".join(arr)

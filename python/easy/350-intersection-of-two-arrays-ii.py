from typing import List


class Solution:
    def intersect(self, nums1: List[int], nums2: List[int]) -> List[int]:
        k = []
        for i in nums2:
            if i in nums1:
                k.append(i)
                nums1.remove(i)
        return k

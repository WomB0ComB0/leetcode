from typing import List, Optional


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def modifiedList(
        self, nums: List[int], head: Optional[ListNode]
    ) -> Optional[ListNode]:
        if head is None:
            return head

        nums_set = set(nums)

        dummy = ListNode(0)
        dummy.next = head

        current = dummy

        while current.next:
            if current.next.val in nums_set:
                current.next = current.next.next
            else:
                current = current.next

        return dummy.next

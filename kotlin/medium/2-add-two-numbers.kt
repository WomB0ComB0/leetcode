/*
You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.


Example 1:


Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.


Example 2:


Input: l1 = [0], l2 = [0]
Output: [0]


Example 3:


Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]



Constraints:


	The number of nodes in each linked list is in the range [1, 100].
	0 <= Node.val <= 9
	It is guaranteed that the list represents a number that does not have leading zeros.
*/

/**
 * Example:
 * var li = ListNode(5)
 * var v = li.`val`
 * Definition for singly-linked list.
 * class ListNode(var `val`: Int) {
 *     var next: ListNode? = null
 * }
 */
class ListNode(var `val`: Int) {
    var next: ListNode? = null
}

class Solution {
    fun addTwoNumbers(l1: ListNode?, l2: ListNode?): ListNode? {
        val dummy = ListNode(0)
        var cur = dummy
        var carry = 0

        var l1 = l1
        var l2 = l2

        while (l1 != null || l2 != null || carry != 0) {
            val v1 = l1?.`val` ?: 0
            val v2 = l2?.`val` ?: 0

            val sum = v1 + v2 + carry
            carry = sum / 10
            val value = sum % 10

            cur.next = ListNode(value)
            cur = cur.next
            l1 = l1?.next
            l2 = l2?.next
        }
        return dummy.next
    }
}

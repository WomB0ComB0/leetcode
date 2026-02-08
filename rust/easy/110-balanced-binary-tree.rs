/*
Given a binary tree, determine if it is height-balanced.

 
Example 1:


Input: root = [3,9,20,null,null,15,7]
Output: true


Example 2:


Input: root = [1,2,2,3,3,null,null,4,4]
Output: false


Example 3:


Input: root = []
Output: true


 
Constraints:


	The number of nodes in the tree is in the range [0, 5000].
	-104 <= Node.val <= 104
*/

// Definition for a binary tree node.
// #[derive(Debug, PartialEq, Eq)]
// pub struct TreeNode {
//   pub val: i32,
//   pub left: Option<Rc<RefCell<TreeNode>>>,
//   pub right: Option<Rc<RefCell<TreeNode>>>,
// }
// 
// impl TreeNode {
//   #[inline]
//   pub fn new(val: i32) -> Self {
//     TreeNode {
//       val,
//       left: None,
//       right: None
//     }
//   }
// }
use std::rc::Rc;
use std::cell::RefCell;
impl Solution {
    pub fn is_balanced(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
        
    }
}
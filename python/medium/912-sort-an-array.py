from typing import List


class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        # Base case: if the array has 1 or fewer elements, it's already sorted
        if len(nums) > 1:
            # Divide the array into two halves
            r: int = len(nums) // 2
            L: List[int] = nums[:r]  # Left half
            M: List[int] = nums[r:]  # Right half

            # Recursively sort both halves
            self.sortArray(L)
            self.sortArray(M)

            # Merge the sorted halves
            i = j = k = 0

            # Compare elements from both halves and place them in the correct position
            while i < len(L) and j < len(M):
                if L[i] < M[j]:
                    nums[k] = L[i]
                    i += 1
                else:
                    nums[k] = M[j]
                    j += 1
                k += 1

            # If there are any remaining elements in the left half, add them
            while i < len(L):
                nums[k] = L[i]
                i += 1
                k += 1

            # If there are any remaining elements in the right half, add them
            while j < len(M):
                nums[k] = M[j]
                j += 1
                k += 1

        return nums

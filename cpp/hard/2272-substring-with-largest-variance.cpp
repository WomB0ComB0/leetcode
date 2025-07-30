/*
The variance of a string is defined as the largest difference between the number of occurrences of
any 2 characters present in the string. Note the two characters may or may not be the same.

Given a string s consisting of lowercase English letters only, return the largest variance possible
among all substrings of s.

A substring is a contiguous sequence of characters within a string.


Example 1:


Input: s = "aababbb"
Output: 3
Explanation:
All possible variances along with their respective substrings are listed below:
- Variance 0 for substrings "a", "aa", "ab", "abab", "aababb", "ba", "b", "bb", and "bbb".
- Variance 1 for substrings "aab", "aba", "abb", "aabab", "ababb", "aababbb", and "bab".
- Variance 2 for substrings "aaba", "ababbb", "abbb", and "babb".
- Variance 3 for substring "babbb".
Since the largest possible variance is 3, we return it.


Example 2:


Input: s = "abcde"
Output: 0
Explanation:
No letter occurs more than once in s, so the variance of every substring is 0.



Constraints:


        1 <= s.length <= 104
        s consists of lowercase English letters.
*/

#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Solution {
   public:
    int largestVariance(string s) {
        vector<int> counter(26, 0);
        for (char ch : s) {
            counter[ch - 'a']++;
        }
        int globalMax = 0;

        for (int i = 0; i < 26; i++) {
            for (int j = 0; j < 26; j++) {
                // major and minor cannot be the same, and both must appear in s.
                if (i == j || counter[i] == 0 || counter[j] == 0) {
                    continue;
                }

                // Find the maximum variance of major - minor.
                char major = 'a' + i;
                char minor = 'a' + j;
                int majorCount = 0;
                int minorCount = 0;

                // The remaining minor in the rest of s.
                int restMinor = counter[j];

                for (char ch : s) {
                    if (ch == major) {
                        majorCount++;
                    }
                    if (ch == minor) {
                        minorCount++;
                        restMinor--;
                    }

                    // Only update the variance (local_max) if there is at least one minor.
                    if (minorCount > 0)
                        globalMax = max(globalMax, majorCount - minorCount);

                    // We can discard the previous string if there is at least one remaining minor
                    if (majorCount < minorCount && restMinor > 0) {
                        majorCount = 0;
                        minorCount = 0;
                    }
                }
            }
        }

        return globalMax;
    }
};

int main() {
    string s = "aababbb";
    Solution solution;
    int result = solution.largestVariance(s);
    cout << result << endl;
    return 0;
}

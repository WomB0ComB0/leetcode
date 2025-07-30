/*
The variance of a string is defined as the largest difference between the number of occurrences of any 2 characters present in the string. Note the two characters may or may not be the same.

Given a string s consisting of lowercase English letters only, return the largest variance possible among all substrings of s.

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

/**
 * @param {string} s
 * @return {number}
 */
var largestVariance = function(s) {
    const counter = Array(26).fill(0);
    for (const ch of s) {
        counter[ch.charCodeAt(0) - 'a'.charCodeAt(0)]++;
    }

    let globalMax = 0;

    for (let i = 0; i < 26; i++) {
        for (let j = 0; j < 26; j++) {
            if (i === j || counter[i] === 0 || counter[j] === 0) {
                continue;
            }

            const major = String.fromCharCode('a'.charCodeAt(0) + i);
            const minor = String.fromCharCode('a'.charCodeAt(0) + j);

            let majorCount = 0;
            let minorCount = 0;
            let restMinor = counter[j];

            for (const ch of s) {
                if (ch === major) {
                    majorCount++;
                }
                if (ch === minor) {
                    minorCount++;
                    restMinor--;
                }

                if (minorCount > 0) {
                    globalMax = Math.max(globalMax, majorCount - minorCount);
                }

                if (majorCount < minorCount && restMinor > 0) {
                    majorCount = 0;
                    minorCount = 0;
                }
            }
        }
    }

    return globalMax;
};

class Solution {
  int maxScore(String s) {
    int maxVal = 0;
    for (int i = 1; i < s.length; i++) {
      maxVal = max(
          maxVal, count(s.substring(0, i), "0") + count(s.substring(i), "1"));
    }
    return maxVal;
  }
}

int count(String s, String sub) {
  return s.split(sub).length - 1;
}

int max(int a, int b) {
  return a > b ? a : b;
}

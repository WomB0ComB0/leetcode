function countConsistentStrings(allowed: string, words: string[]): number {
  /**
   * Convert the allowed string to a set for O(1) lookup
   * Use reduce to count the number of words that are consistent
   */
  const allowed_set: Set<string> = new Set(allowed);
  return words.reduce((count, word) => {
    // check if every character in the word is in the allowed set
    if (Array.from(word).every((char) => allowed_set.has(char))) {
      return count + 1;
    }
    return count;
  }, 0);
}

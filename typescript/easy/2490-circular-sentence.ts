/**
 * Checks if a sentence is circular.
 * @param {string} sentence - The input sentence.
 * @returns {boolean} - True if the sentence is circular, false otherwise.
 */
function isCircularSentence(sentence: string): boolean {
  /**
   * sentence = 'This is a circular sentence'
   * .split(' ') -> ['This', 'is', 'a', 'circular', 'sentence']
   * .every((word, index, words) => word[word.length - 1] === words[(index + 1) % words.length][0])
   *
   * word = 'This'
   * index = 0
   * words = ['This', 'is', 'a', 'circular', 'sentence']
   *
   * word[word.length - 1] = 's'
   * (index + 1) % words.length -> 1 % 5 = 1
   * words[(index + 1) % words.length] = 'is'
   * 's' === 'i' -> false
   */
  return sentence
    .split(' ')
    .every((word, index, words) => word[word.length - 1] === words[(index + 1) % words.length][0]);
}

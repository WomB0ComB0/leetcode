/**
 * Compresses a string by replacing sequences of the same character with the character followed by the count of repetitions.
 * The count is capped at 9 for each character.
 *
 * @param {string} word - The input string to be compressed.
 * @return {string} - The compressed string.
 */
const compressedString = (word: string): string => {
  // Return an empty string if the input is empty
  if (!word) return '';

  let res = ''; // Resulting compressed string
  let count = 1; // Counter for consecutive characters
  const n: number = word.length; // Length of the input string

  // Iterate through the string starting from the second character
  for (let i = 1; i < n; i++) {
    // If the current character is the same as the previous one and count is less than 9, increment the count
    if (word[i] === word[i - 1] && count < 9) {
      count++;
    } else {
      // Otherwise, append the count and the previous character to the result
      res += count + word[i - 1];
      count = 1; // Reset the count for the new character
    }
  }
  // Append the count and the last character to the result
  res += count + word[n - 1];
  return res; // Return the compressed string
};

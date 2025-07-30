class Solution:
    @staticmethod
    def compressedString(word: str) -> str:
        """
        Compresses a string by replacing sequences of the same character with the character followed by the count of repetitions.
        The count is capped at 9 for each character.

        Args:
            word (str): The input string to be compressed.

        Returns:
            str: The compressed string.
        """
        # Return an empty string if the input is empty
        if not word:
            return ""

        res = ""  # Resulting compressed string
        count = 1  # Counter for consecutive characters
        n = len(word)  # Length of the input string

        # Iterate through the string starting from the second character
        for i in range(1, n):
            # If the current character is the same as the previous one and count is less than 9, increment the count
            if word[i] == word[i - 1] and count < 9:
                count += 1
            else:
                # Otherwise, append the count and the previous character to the result
                res += str(count) + word[i - 1]
                count = 1  # Reset the count for the new character

        # Append the count and the last character to the result
        res += str(count) + word[-1]
        return res  # Return the compressed string

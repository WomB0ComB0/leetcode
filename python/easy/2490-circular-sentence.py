from itertools import pairwise


class Solution:
    def isCircularSentence(self, sentence: str) -> bool:
        """
        Checks if a sentence is circular.

        Args:
            sentence (str): The input sentence.

        Returns:
            bool: True if the sentence is circular, false otherwise.
        """
        # Split the sentence into words
        # words = sentence.split()

        # Create a new list that is the original list of words plus the first word again
        # circular_words = words + words[:1]

        # Use pairwise to create pairs of consecutive words
        # pairs = pairwise(circular_words)

        # Check if the last character of each word matches the first character of the next word
        # result = all(x[-1] == y[0] for x, y in pairs)
        return all(
            x[-1] == y[0]
            for x, y in pairwise(list(sentence.split()) + list(sentence.split())[:1])
        )

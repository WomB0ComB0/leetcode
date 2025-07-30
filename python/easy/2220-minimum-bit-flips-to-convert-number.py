class Solution:
    def minBitFlips(self, start: int, goal: int) -> int:
        # convert to binary
        start_binary = self.intToBinary(start)
        goal_binary = self.intToBinary(goal)

        # get the max length of the binary to pad the shorter binary with 0
        max_length = max(len(start_binary), len(goal_binary))

        # pad the shorter binary with 0 to make them the same length
        start_binary = start_binary.zfill(max_length)
        goal_binary = goal_binary.zfill(max_length)

        # count the number of different bits,
        start_binary_map = {i: start_binary[i] for i in range(len(start_binary))}
        goal_binary_map = {i: goal_binary[i] for i in range(len(goal_binary))}

        # count the number of different bits
        count = 0
        for i in range(max_length):
            if start_binary_map[i] != goal_binary_map[i]:
                count += 1
        return count

    def intToBinary(self, num: int) -> str:
        # convert to binary
        """
        example:
        num = 5
        return bin(5)[2:] = '101'
        we use [2:] to remove the '0b' prefix
        """
        return bin(num)[2:]


# class Solution:
# def minBitFlips(self, start: int, goal: int) -> int:
# XOR operation to get the different bits
# bit_count() to count the number of 1
# return (start ^ goal).bit_count()

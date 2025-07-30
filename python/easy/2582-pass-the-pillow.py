class Solution:
    def passThePillow(self, n: int, time: int) -> int:
        direc, i = 1, 1
        while time:
            if i == n:
                direc = -1
            if i == 1:
                direc = 1
            i += direc
            time -= 1
        return i

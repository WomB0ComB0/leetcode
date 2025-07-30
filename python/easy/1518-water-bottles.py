class Solution:
    def numWaterBottles(self, numBottles: int, numExchange: int) -> int:
        curr: int = numBottles
        while numBottles >= numExchange:
            curr += numBottles // numExchange
            numBottles = numBottles // numExchange + numBottles % numExchange
        return curr

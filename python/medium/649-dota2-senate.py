from typing import Dict, List, Tuple
from collections import deque


class Solution:
    def predictPartyVictory(self, senate: str) -> str:
        radiant: deque = deque()
        dire: deque = deque()

        for i, s in enumerate(senate):
            if s == "R":
                radiant.append(i)
            else:
                dire.append(i)

        n: int = len(senate)

        while radiant and dire:
            ri = radiant.popleft()
            di = dire.popleft()

            if ri < di:
                radiant.append(ri + n)
            else:
                dire.append(di + n)
        return "Radiant" if radiant else "Dire"

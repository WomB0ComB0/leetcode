/**
 * @param {number[]} gifts
 * @param {number} k
 * @return {number}
 */
var pickGifts = function (gifts, k) {
  const maxHeap = gifts.map(gift => -gift);
  maxHeap.sort((a, b) => a - b);

  for (const _ of Array(k)) {
    const maxGift = -maxHeap.shift();
    const newGift = Math.floor(Math.sqrt(maxGift));
    maxHeap.push(-newGift);
    maxHeap.sort((a, b) => a - b);
  }

  return maxHeap.reduce((sum, value) => sum - value, 0);
};
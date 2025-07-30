// @ts-ignore
function pickGifts(gifts: number[], k: number): number {
  const maxHeap: number[] = gifts.map((gift) => -gift);
  maxHeap.sort((a, b) => a - b);

  const heapify = (): void => {
    maxHeap.sort((a, b) => a - b);
  };
  for (const _ of Array(k)) {
    const maxGift = -maxHeap.shift()!; // Remove the maximum (largest negative becomes smallest)
    const newGift = Math.floor(Math.sqrt(maxGift)); // Replace with the square root floored
    maxHeap.push(-newGift); // Add back to the heap
    heapify(); // Reheapify the heap
  }

  return maxHeap.reduce((sum, value) => sum - value, 0); // Negate values again to get the original sum
}

/**
 * Finds the minimum number of obstacles that need to be removed to reach the bottom-right corner of a grid.
 * Uses Dijkstra's algorithm with a min heap to find the shortest path from top-left to bottom-right,
 * where the weight of each edge is the value in the grid cell (0 for empty cell, 1 for obstacle).
 *
 * @param grid - A binary matrix where 0 represents empty cell and 1 represents obstacle
 *               grid[i][j] is either 0 or 1
 *               1 <= grid.length, grid[0].length <= 10^5
 * @returns Minimum number of obstacles that must be removed to create a path from (0,0) to (R-1,C-1)
 *          Returns -1 if no path exists
 *
 * @example
 * ```ts
 * minimumObstacles([[0,1,1],[1,1,0],[1,1,0]]) // Returns 2
 * // Must remove 2 obstacles to create path: (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2)
 * ```
 *
 * Time Complexity: O(RC * log(RC)) where R is number of rows and C is number of columns
 * Space Complexity: O(RC) for the cache and heap
 */
function minimumObstacles(grid: number[][]): number {
  const R: number = grid.length,
    C: number = grid[0].length;

  const cache: number[][] = Array.from({ length: R }, () =>
    Array(C).fill(Number.POSITIVE_INFINITY),
  );
  cache[0][0] = grid[0][0];
  const heap = new Heap([[grid[0][0], 0, 0]]);

  while (!heap.isEmpty()) {
    const [w, r, c] = heap.pop();
    if (r === R - 1 && c === C - 1) {
      return w + grid[R - 1][C - 1];
    }

    for (const [nr, nc] of [
      [r + 1, c],
      [r - 1, c],
      [r, c + 1],
      [r, c - 1],
    ]) {
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && w < cache[nr][nc]) {
        cache[nr][nc] = w;
        heap.push([w + grid[nr][nc], nr, nc]);
      }
    }
  }

  return -1;
}

/**
 * A min heap implementation specialized for the obstacle removal problem.
 * Each heap element is a tuple of [weight, row, col] where:
 * - weight: Number of obstacles encountered in path so far
 * - row: Current row position
 * - col: Current column position
 */
class Heap {
  /** Internal array storing heap elements */
  private heap: [number, number, number][] = [];

  /**
   * Creates a new heap and heapifies the input array
   * @param x - Initial array of [weight, row, col] tuples to heapify
   */
  constructor(x: [number, number, number][]) {
    this.heap = x;
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this._siftDown(i);
    }
  }

  /**
   * Adds a new element to the heap
   * @param val - Tuple of [weight, row, col] to add
   */
  push(val: [number, number, number]) {
    this.heap.push(val);
    this._siftUp(this.heap.length - 1);
  }

  /**
   * Removes and returns the minimum element from the heap
   * @returns Tuple of [weight, row, col] with minimum weight
   * @throws Error if heap is empty
   */
  pop(): [number, number, number] {
    if (this.heap.length === 0) throw new Error('Heap is empty');

    const result = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._siftDown(0);
    }

    return result;
  }

  /**
   * Moves an element up the heap until heap property is restored
   * @param index - Index of element to sift up
   */
  private _siftUp(index: number) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex][0] > this.heap[index][0]) {
        [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * Moves an element down the heap until heap property is restored
   * @param index - Index of element to sift down
   */
  private _siftDown(index: number) {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < length && this.heap[leftChild][0] < this.heap[smallest][0]) {
        smallest = leftChild;
      }
      if (rightChild < length && this.heap[rightChild][0] < this.heap[smallest][0]) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }

  /**
   * Returns the current number of elements in the heap
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * Checks if the heap is empty
   * @returns true if heap has no elements, false otherwise
   */
  isEmpty(): boolean {
    return this.size() === 0;
  }
}

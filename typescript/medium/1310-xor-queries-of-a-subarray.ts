function xorQueries(arr: number[], queries: number[][]): number[] {
  const xors = [0];
  /**
   * prefix XOR
   * xors[i] = arr[0] ^ arr[1] ^ ... ^ arr[i-1]
   * xors[j] = arr[0] ^ arr[1] ^ ... ^ arr[j-1]
   * xors[j] ^ xors[i] = arr[i] ^ arr[i+1] ^ ... ^ arr[j-1]
   */
  for (let i = 0; i < arr.length; i++) {
    xors[i + 1] = xors[i] ^ arr[i];
  }
  /**
   * [1, 3, 4, 8]
   * [0, 1, 4, 8, 16]
   * [0, 1, 2, 6, 14]
   * [0, 1, 4, 8, 16]
   * [0, 1, 2, 6, 14]
   * [0, 1, 2, 6, 14]
   * [0, 1, 2, 6, 14]
   */
  return queries.map(([i, j]) => xors[j + 1] ^ xors[i]);
}

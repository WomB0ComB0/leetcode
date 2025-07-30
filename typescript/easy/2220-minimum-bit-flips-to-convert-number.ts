function minBitFlips(start: number, goal: number): number {
  // convert to binary
  let startBinary = intToBinary(start);
  let goalBinary = intToBinary(goal);
  // get the max length of the binary to pad the shorter binary with 0
  /**
   * pad is the padding of the shorter binary with 0
   * example: start = 10, goal = 32 -> 1010 ^ 100000 = 0010 -> 2
   */
  const maxLength = Math.max(startBinary.length, goalBinary.length);
  // pad the shorter binary with 0 to make them the same length
  startBinary = startBinary.padStart(maxLength, '0');
  goalBinary = goalBinary.padStart(maxLength, '0');
  let count = 0;
  // count the number of different bits
  for (let i = 0; i < maxLength; i++) {
    if (startBinary[i] !== goalBinary[i]) {
      count++;
    }
  }
  return count;
}

// convert to binary
function intToBinary(num: number): string {
  return num.toString(2);
}

// XOR operation to get the different bits
// function minBitFlips(start: number, goal: number): number {
/**
 * (start ^ goal) -> XOR operation to get the different bits
 * * example: start = 10, goal = 8 -> 1010 ^ 1000 = 0010 -> 2
 * toString(2) -> convert to binary
 * split('') -> split to array
 * filter(bit => bit === '1') -> filter to 1
 * length -> count the number of 1
 */
//     return (start ^ goal).toString(2).split('').filter(bit => bit === '1').length;
// }

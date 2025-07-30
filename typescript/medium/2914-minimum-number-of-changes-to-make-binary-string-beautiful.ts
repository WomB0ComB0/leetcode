/**
 * Given a binary string s, return the minimum number of changes needed to make s beautiful.
 * A binary string is beautiful if no two adjacent characters are the same.
 *
 * @param {string} s - The input binary string.
 * @return {number} - The minimum number of changes needed to make the binary string beautiful.
 */
function minChanges(s: string): number {
  return sum(
    map(
      ne,
      s.split('').filter((_, i) => i % 2 === 0),
      s.split('').filter((_, i) => i % 2 !== 0),
    ),
  );
}

/**
 * Sums the elements of an array.
 *
 * @param {number[]} arr - The array of numbers to sum.
 * @return {number} - The sum of the array elements.
 */
const sum = (arr: number[]): number => arr.reduce((acc, curr) => acc + curr, 0);

/**
 * Checks if two characters are not equal.
 *
 * @param {string} a - The first character.
 * @param {string} b - The second character.
 * @return {number} - Returns 1 if the characters are not equal, otherwise returns 0.
 */
const ne = (a: string, b: string): number => (a !== b ? 1 : 0);

/**
 * Maps multiple iterables to a single iterable using a function.
 *
 * @param {Function} func - The function to apply to the elements of the iterables.
 * @param {Iterable} iters - The iterables to map.
 * @return {Iterable} - The mapped iterable.
 */
const map = <T, U>(func: (...args: T[]) => U, ...iters: Iterable<T>[]): U[] => {
  const result: U[] = [];
  const iterators = iters.map((iter) => iter[Symbol.iterator]());

  while (true) {
    const values = iterators.map((iterator) => iterator.next());

    if (values.some((value) => value.done)) break;

    result.push(func(...(values.map((value) => value.value) as [T, T])));
  }

  return result;
};

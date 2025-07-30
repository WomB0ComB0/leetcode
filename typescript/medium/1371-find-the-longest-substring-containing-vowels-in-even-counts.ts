function findTheLongestSubstring(s: string): number {
  let max = 0;
  let state = 0;
  // we can use a map to store the state and the index
  const map = new Map<number, number>();
  // we need to initialize the map with the state 0 and index -1
  map.set(0, -1);
  //
  for (let i = 0; i < s.length; i++) {
    // we need to update the state based on the current character
    if (s[i] === 'a') {
      state ^= 1 << 0;
    } else if (s[i] === 'e') {
      state ^= 1 << 1;
    } else if (s[i] === 'i') {
      state ^= 1 << 2;
    } else if (s[i] === 'o') {
      state ^= 1 << 3;
    } else if (s[i] === 'u') {
      state ^= 1 << 4;
    }
    // if the map has the state, we need to update the max
    if (map.has(state)) {
      // we need to update the max
      max = Math.max(max, i - map.get(state));
    } else {
      // we need to add the state and the index
      map.set(state, i);
    }
  }
  return max;
}

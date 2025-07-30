function maxCount(banned: number[], n: number, maxSum: number): number {
  const b: Set<number> = new Set(banned);
  let acc = 0,
    res = 0,
    i = 1;
  while (acc < maxSum && i <= n)
    if (b.has(i)) i++;
    else (acc += i), i++, res++;
  return acc <= maxSum ? res : res - 1;
}

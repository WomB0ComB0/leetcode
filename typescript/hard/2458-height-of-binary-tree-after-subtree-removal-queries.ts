class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

function treeQueries(root: TreeNode | null, queries: number[]): number[] {
  const Depth = new Map<number, number>(),
    Height = new Map<number, number>();

  const dfs = (node: TreeNode | null, depth: number) => {
    if (!node) return -1;

    Depth.set(node.val, depth);
    const cur = Math.max(dfs(node.left, depth + 1), dfs(node.right, depth + 1)) + 1;
    Height.set(node.val, cur);
    return cur;
  };

  dfs(root, 0);
  const cousins = new Map<number, [number, number][]>();
  for (const [val, depth] of Depth.entries()) {
    if (!cousins.has(depth)) {
      cousins.set(depth, []);
    }
    cousins.get(depth)!.push([-Height.get(val)!, val]);
    cousins.get(depth)!.sort((a, b) => a[0] - b[0]);
    if (cousins.get(depth)!.length > 2) {
      cousins.get(depth)!.pop();
    }
  }

  const ans: number[] = [];
  for (const q of queries) {
    const depth = Depth.get(q)!;
    if (cousins.get(depth)!.length === 1) {
      ans.push(depth - 1);
    } else if (cousins.get(depth)![0][1] === q) {
      ans.push(-cousins.get(depth)![1][0] + depth);
    } else {
      ans.push(-cousins.get(depth)![0][0] + depth);
    }
  }
  return ans;
}

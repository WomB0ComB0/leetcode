from typing import List
import big_o


class Solution:
    def numberOfSubmatrices(self, grid: List[List[str]]) -> int:
        rows: int = len(grid)
        cols: int = len(grid[0])
        count: int = 0

        def count_X_Y(submatrix):
            x_count: int = sum(row.count("X") for row in submatrix)
            y_count: int = sum(row.count("Y") for row in submatrix)
            return x_count, y_count

        for r1 in range(rows):
            for c1 in range(cols):
                for r2 in range(r1, rows):
                    for c2 in range(c1, cols):
                        submatrix: List[List[str]] = [
                            grid[r][c1 : c2 + 1] for r in range(r1, r2 + 1)
                        ]
                        x_count, y_count = count_X_Y(submatrix)
                        if x_count == y_count and x_count > 0:
                            if r1 == 0 and c1 == 0:
                                count += 1
        return count


def main() -> None:
    solution = Solution()
    grids = [
        [["X", "Y", "."], ["Y", ".", "."]],
        [["X", "X"], ["X", "Y"]],
        [[".", "."], [".", "."]],
    ]

    for grid in grids:
        print(solution.numberOfSubmatrices(grid))

    def generate_test_case(n: int) -> List[List[str]]:
        return [["X", "Y", "."] * n for _ in range(n)]

    func = solution.numberOfSubmatrices
    best, _ = big_o.big_o(func, generate_test_case)
    print(f"Best: {best}")


if __name__ == "__main__":
    main()

from typing import List


class Solution:
    def averageWaitingTime(self, customers: List[List[int]]) -> float:
        N: int = len(customers)
        finish_times: List[int] = [0] * N
        for i, (arrival, order_time) in enumerate(customers):
            finish_times[i] = (
                max(finish_times[i - 1] if i > 0 else 0, arrival) + order_time
            )
        wait_times: List[int] = [
            finish - arrival for finish, (arrival, _) in zip(finish_times, customers)
        ]
        return sum(wait_times) / N


def main() -> None:
    customers = [[1, 2], [2, 5], [4, 3]]
    print(Solution().averageWaitingTime(customers))


if __name__ == "__main__":
    main()

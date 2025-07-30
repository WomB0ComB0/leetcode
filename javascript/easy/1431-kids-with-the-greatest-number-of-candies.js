function kidsWithCandies(candies, extraCandies) {
    var max = candies.reduce(function (r, v) { return Math.max(r, v); });
    return candies.map(function (v) { return v + extraCandies >= max; });
}

function partitionString(s) {
    var set = new Set();
    var res = 1;
    for (var _i = 0, s_1 = s; _i < s_1.length; _i++) {
        var c = s_1[_i];
        if (set.has(c)) {
            res++;
            set.clear();
        }
        set.add(c);
    }
    return res;
}
;

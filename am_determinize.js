var am_determinize = function(am)
{
    /*
    既に決定性なものは無視
    */
    loop: for (var i = am.states.length - 1; i >= 0; i--)
    {
        if (am.transFunc[am.states[i]]["ε"] !== undefined)
            if (am.transFunc[am.states[i]]["ε"].length > 0)
                break;
        for (var j = am.alphabets.length - 1; j >= 0; j--)
        {
            if (am.transFunc[am.states[i]][am.alphabets[j]].length > 1)
                break loop;
        };
        if (i == 0) return am;
    };

    var epsTrans = function(states)
    /*
    状態の集合をうけ、要素のいずれかからε遷移のみで辿りつける状態の集合を返す。
    */
    {
        if (am.alphabets.indexOf("ε") == -1) return states;
        var epsStates = [];
        var pool = {};
        for (var i = am.states.length - 1; i >= 0; i--)
            pool[am.states[i]] = true;
        for (var i = states.length - 1; i >= 0; i--)
        {
            if (pool[states[i]] == false) continue;
            (function eps(q){
                pool[q] = false;
                epsStates.push(q);
                for (var i = am.transFunc[q]["ε"].length - 1; i >= 0; i--)
                    if (pool[am.transFunc[q]["ε"][i]])
                        eps(am.transFunc[q]["ε"][i]);
            })(states[i]);
        };
        return epsStates;
    }

    var formatStateSet = function(a)
    {
        if (a.length == 0) return "Φ";
        return "{" + a.sort().join("|") + "}";
    }

    var alphabets = [];
    for (var i = am.alphabets.length - 1; i >= 0; i--)
        if (am.alphabets[i] != "ε")
            alphabets.push(am.alphabets[i]);
    var stateInit = epsTrans([am.stateInit]).sort();
    var stateInitFormat = formatStateSet(stateInit);
    /*
    初期状態をもとに状態と遷移関数をつくり上げていく
    遷移関数が待ち行列に入れるかどうかのフラグを兼ねる
    */
    var states = [];
    var transFunc = {};
    var queue = new Array(stateInit);
    while (queue.length > 0)
    {
        var state = queue.shift();
        var stateFormat = formatStateSet(state);
        if (transFunc[stateFormat] !== undefined)
            continue;
        states.push(state);
        transFunc[stateFormat] = {};
        for (var i = alphabets.length - 1; i >= 0; i--)
        {
            transFunc[stateFormat][alphabets[i]] = [];
            var stateNext = [];
            for (var j = state.length - 1; j >= 0; j--)
                stateNext = stateNext.concat(am.transFunc[state[j]][alphabets[i]]);
            stateNext = unique(stateNext);
            stateNext = epsTrans(stateNext);
            var stateNextFormat = formatStateSet(stateNext);
            transFunc[stateFormat][alphabets[i]].push(stateNextFormat);
            if (transFunc[stateNextFormat] === undefined)
                queue.push(stateNext);
        }
    }
    var statesFormat = states.map(formatStateSet);
    var statesFin = states.map(function(s)
    {
        for (var i = s.length - 1; i >= 0; i--)
            for (var j = am.statesFin.length - 1; j >= 0; j--)
                if (am.statesFin[j] == s[i])
                    return s;
    });
    for (var i = statesFin.length - 1; i >= 0; i--)
        if (statesFin[i] === undefined)
            statesFin.splice(i,1);
    var statesFinFormat = statesFin.map(formatStateSet);
    return new myAutoMaton
    (
        alphabets,
        statesFormat,
        transFunc,
        stateInitFormat,
        statesFinFormat
    );
}

myAutoMaton.prototype.determinize = function() {
    return am_determinize(this);
};
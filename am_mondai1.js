var am_input = function(am, w)
/*問題１：wを認識する場合はtrue、しない場合はfalseを返す*/
{
    var queue = [[am.stateInit,w]];
    var checkList = [];
    while (queue.length > 0)
    {
        var state_word = queue.shift();
        checkList[state_word.join(",")] = true;
        var state = state_word[0];
        var word  = state_word[1];
        if (word.length == 0 && am.statesFin.length != 0)
            for (var i = 0; i < am.statesFin.length; i++)
                if (am.statesFin[i] == state)
                    return true;
        if (am.transFunc[state][word[0]] !== undefined)
            for (var i = 0; i < am.transFunc[state][word[0]].length; i++)
                if (checkList[[am.transFunc[state][word[0]], word.slice(1)].join(",")] != true)
                    queue.push([am.transFunc[state][word[0]][i], word.slice(1)]);
        if (am.transFunc[state]["ε"] !== undefined)
            for (var i = 0; i < am.transFunc[state]["ε"].length; i++)
                if (checkList[[am.transFunc[state]["ε"], word].join(",")] != true)
                   queue.push([am.transFunc[state]["ε"][i], word]);
    }
    return false;
}

myAutoMaton.prototype.input = function(w) {
    return am_input(this, w);
};

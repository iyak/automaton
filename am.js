var myAutoMaton = function(alphabets, states, transFunc, stateInit, statesFin)
{
    this.alphabets = alphabets;
    this.states    = states;
    this.transFunc = transFunc;
    this.stateInit = stateInit;
    this.statesFin = statesFin;
  
    this.input = function(w)
    /*問題１：wを認識する場合はtrue、しない場合はfalseを返す*/
    {
        var queue = [[stateInit,w]];
        var checkList = [];
        while (queue.length > 0)
        {
            var state_word = queue.shift();
            checkList[state_word.join(",")] = true;
            var state = state_word[0];
            var word  = state_word[1];
            if (word.length == 0 && statesFin.length != 0)
                for (var i = 0; i < statesFin.length; i++)
                    if (statesFin[i] == state)
                        return true;
            if (transFunc[state][word[0]] !== undefined)
                for (var i = 0; i < transFunc[state][word[0]].length; i++)
                    if (checkList[[transFunc[state][word[0]], word.slice(1)].join(",")] != true)
                        queue.push([transFunc[state][word[0]][i], word.slice(1)]);
            if (transFunc[state]["ε"] !== undefined)
                for (var i = 0; i < transFunc[state]["ε"].length; i++)
                    if (checkList[[transFunc[state]["ε"], word].join(",")] != true)
                       queue.push([transFunc[state]["ε"][i], word]);
        }
        return false;
    }
}

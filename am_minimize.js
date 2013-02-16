var am_minimize = function(am)
{
    am = am.determinize();

    var markList = {};
    /*
    declare markList as 2-dementional hash object
    , which is given extra size to simplification.
    */
    for (var i = am.states.length - 1; i >= 0; i--)
    {
        markList[am.states[i]] = {};
        markList[am.states[i]].length = i;
        markList[am.states[i]].root = [am.states[i]];
    }
    /*
    init markList, whose cells consist of true/false/undefined.
    */
    for (var i = am.statesFin.length - 1; i >= 0; i--)
    {
        for (var j = am.states.length - 1; j >= 0; j--)
        {
            if (markList[am.statesFin[i]][am.states[j]] === undefined)
                markList[am.statesFin[i]][am.states[j]] = true;
            else if (markList[am.statesFin[i]][am.states[j]] === true)
                markList[am.statesFin[i]][am.states[j]] = false;

            if (markList[am.states[j]][am.statesFin[i]] === undefined)
                markList[am.states[j]][am.statesFin[i]] = true;
            else if (markList[am.states[j]][am.statesFin[i]] === true)
                markList[am.states[j]][am.statesFin[i]] = false;
        };
    };
    /*
    fill up markList
    */
    do
    {
        var update = false;
        for (var i = am.states.length - 1; i >= 0; i--)
        {
            for (var j = markList[am.states[i]].length - 1; j >= 0; j--)
            {
                if (markList[am.states[i]][am.states[j]] !== true)
                    continue;
                /*
                look for other states from which can reach
                these two states with one same character.
                */
                for (var k = am.alphabets.length - 1; k >= 0; k--)
                {
                    var identicalSet = [[],[]];
                    for (var l = am.states.length - 1; l >= 0; l--)
                    {
                        var s = am.transFunc[am.states[l]][am.alphabets[k]][0];
                        if (s == am.states[i])
                            identicalSet[0].push(am.states[l]);
                        else if (s == am.states[j])
                            identicalSet[1].push(am.states[l]);
                    };
                    for (var l = identicalSet[0].length - 1; l >= 0; l--)
                    {
                        for (var m = identicalSet[1].length - 1; m >= 0; m--)
                        {
                            if (markList[identicalSet[0][l]][identicalSet[1][m]])
                                continue;
                            if (markList[identicalSet[1][m]][identicalSet[0][l]])
                                continue;
                            markList[identicalSet[0][l]][identicalSet[1][m]] = true;
                            markList[identicalSet[1][m]][identicalSet[0][l]] = true;
                            update = true;
                        };
                    };
                };
            };
        };
    } while (update);
    /*
    build equevalence relation between states according to markList
    */
    for (var i = am.states.length - 1; i > 0; i--)
        for (var j = markList[am.states[i]].length - 1; j >= 0; j--)
            if (markList[am.states[i]][am.states[j]] !== true)
                markList[am.states[i]].root
                    = markList[am.states[j]].root
                    = markList[am.states[i]].root
                        .concat(markList[am.states[j]].root);
    for (var i = am.states.length - 1; i >= 0; i--)
        markList[am.states[i]].rootFormat
            = formatStateSet(unique(markList[am.states[i]].root));
    /*
    build transition relation
    */
    var states = [];
    var transFunc = {};
    function merge(s){
        if (transFunc[markList[s].rootFormat] !== undefined)
            return;
        transFunc[markList[s].rootFormat] = {};
        states.push(markList[s].rootFormat);
        for (var i = am.alphabets.length - 1; i >= 0; i--)
        {
            transFunc[markList[s].rootFormat][am.alphabets[i]]
                = [markList[am.transFunc[s][am.alphabets[i]][0]].rootFormat];
            merge(am.transFunc[s][am.alphabets[i]][0]);
        };
        return;
    };
    merge(am.stateInit);
    var statesFin = am.statesFin.map(function(s)
    {
       return  markList[s].rootFormat;
    });
    statesFin = unique(statesFin);
    return new myAutoMaton
    (
        am.alphabets,
        states,
        transFunc,
        markList[am.stateInit].rootFormat,
        statesFin
    );
}

myAutoMaton.prototype.minimize = function() {
    return am_minimize(this);
};
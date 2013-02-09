var am_mondai6 = function(am)
{
    var que = [am.stateInit];
    var checkList = [];
    if (am.statesFin.length==0)
	return true;
    
    while (que.length > 0){
	var state = que.shift();
	checkList[state] = true;
	for (var i=0; i<am.statesFin.length; i++)
	    if (am.statesFin[i]==state)
		return false;

	for (var i=0; i<am.alphabets.length; i++){
	    var nxtstate = am.transFunc[state][am.alphabets[i]];
	    
	    for (var j=0; j<am.statesFin.length; j++)
		if (am.statesFin[j]==nxtstate)
		    return false;
	    
	    if (nxtstate!==undefined && checkList[nxtstate]!=true)
		que.push(nxtstate);
	}
    }
    return true;
}

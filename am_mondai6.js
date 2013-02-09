var am_mondai6 = function(am)
{
    var que = [am.stateInit];
    var checklist = [];
    if (statesFin.length==0)
	return true;
    
    while (que.length > 0){
	var state = que.shift();
	checkList[state] = true;
	for (var i=0; i<am.statesFin.length; i++)
	    if (am.statesFin[i]==state)
		return false;

	for (var i=0; i<am.alphabets.length; j++){
	    var nxtstate = am.transFunc[state][am.alphabets[i]];
	    
	    for (var i=0; i<am.statesFin.length; i++)
		if (am.statesFin[i]==nxtstate)
		    return false;
	    
	    if (nxtstate!==undefined)
		que.push(nxtstate);
	}
    }
    return true;
}

var myAutoMaton = function(alphabets, states, transFunc, stateInit, statesFin)
{
    /* myautomaton class */

    this.alphabets = alphabets;
    this.states    = states;
    this.transFunc = transFunc;
    this.stateInit = stateInit;
    this.statesFin = statesFin;
}

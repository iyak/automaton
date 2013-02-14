$(function(){

    var alphabets = [];
    var states    = [];
    var transFunc = {};
    var stateInit;
    var statesFin = [];

    /*
    read inputs
    */
    var readInputAlphabets = function()
    {
        var input = $(".program .alphabets input[name=\"alphabets\"]").val();
        if (input != "")
            alphabets = input.split(/[ ,]*,[ ,]*/);
        for (var i = 0; i < alphabets.length; i++)
            if (alphabets[i].length != 1)
                alphabets.splice(i--, 1);
        /*
        allow epsilon transition or not
        */
        if ($(".program .alphabets input[name=\"allowEpsilon\"]").is(":checked"))
        {
            alphabets.push("ε");
        }
        else
        {
            for (var i = 0; i < alphabets.length; ++i)
                if (alphabets[i] == "ε")
                    alphabets.splice(i, 1);
        }
        alphabets = unique(alphabets);
        $(".program .alphabets input[name=\"alphabets\"]").val(alphabets.join(","));
        return alphabets;
    }
    var readInputStates = function()
    {
        states = $(".program .statesTable .state").map(function()
        {
            var id = $(this).find("input[name=\"stateId\"]").val();
            $(this).attr("stateId",id);
            return id;
        }).toArray();
        return states;
    }
    var readInputTransFunc = function()
    {
        for (var i = states.length - 1; i >= 0; i--)
        {
            transFunc[states[i]] = {};
            for (var j = alphabets.length - 1; j >= 0; j--)
            {
                transFunc[states[i]][alphabets[j]] = new Array;
                var input = $(".program .statesTable .state[stateId=\""
                    + states[i] + "\"]").find(".statesNext[for=\""
                    + alphabets[j] + "\"]").find("input[name=\"statesNext\"]").val();
                if (input.length == 0) continue;
                var statesNext = input.split(/[ ,]*,[ ,]*/);
                loop: for (var k = 0; k < statesNext.length; k++)
                {
                    for (var l = 0; l < states.length; l++)
                        if (statesNext[k] == states[l])
                            continue loop;
                    statesNext.splice(k--, 1);
                    statesNext = unique(statesNext);
                    notice(states[i], "do not point non-exist state id.", 6);
                    $(".program .statesTable .state[stateId=\""
                    + states[i] + "\"]").find(".statesNext[for=\""
                    + alphabets[j] + "\"]").find("input[name=\"statesNext\"]")
                        .val(statesNext.join(","));
                }
                transFunc[states[i]][alphabets[j]] = statesNext;
            }
        }
        return transFunc;
    }
    var readInputStateInit = function()
    {
        stateInit = $(".program input[name=\"isInit\"]").filter(":checked")
            .closest(".state").attr("stateId");
        return stateInit;
    }
    var readInputStatesFin = function()
    {
        statesFin = $(".program input[name=\"isFin\"]").filter(":checked").map(function()
        {
            return $(this).closest(".state").attr("stateId");
        }).toArray();
        return statesFin;
    }


    /*
    inport JSON data
    */
    var inportJSON = function()
    {
        var am_json = JSON.parse($(".program input[name=\"inport\"]").val());
        /*
        clear states
        */
        $(".statesTable tbody").remove();
        $(".statesTable").load("index.html .statesTable tbody", function()
        {
            for (var i = 0; i < am_json.states.length; ++i)
            {
                var init = (am_json.states[i] == am_json.stateInit);
                var fin = false;
                for (var j = 0; j < am_json.statesFin.length; ++j)
                    if (am_json.states[i] == am_json.statesFin[j])
                        fin = true;
                addState(am_json.states[i], init, fin);
            }
            /*remove dammy state (the first state)*/
            $(".program .state").filter(":first").remove();
            /*
            add alphabets
            */
            $(".program .alphabets input[name=\"allowEpsilon\"]").attr("checked", false);
            $(".program input[name=\"alphabets\"]").val(am_json.alphabets.join(","));
            $(".program .alphabets input[name=\"alphabets\"]").val(am_json.alphabets.join(","));
            for (var i = 0; i < am_json.alphabets.length; ++i)
                if (am_json.alphabets[i] == "ε")
                    $(".program .alphabets input[name=\"allowEpsilon\"]").attr("checked", true);
            addAlphabets(readInputAlphabets());
            /*
            add transition relation
            */
            for (var i = 0; i < am_json.states.length; ++i)
                for (var j = 0; j < am_json.alphabets.length; ++j)
                    $(".program .state[stateId=\"" + am_json.states[i] + "\"]")
                        .find(".statesNext[for=\"" + am_json.alphabets[j] + "\"] input")
                            .val(am_json.transFunc[am_json.states[i]][am_json.alphabets[j]]);
        });
    }
    $(".program button[name=\"inport\"]").on("click", inportJSON);

    /*
    input alphabets
    */
    var addAlphabets = function(as)
    {
        $(".program .labelNext").removeClass("chkd");
        $(".program .statesNext").removeClass("chkd");
        for (var i = 0; i < alphabets.length; i++)
        {
            addAlphabet(as[i]);
        }
        $(".program .labelNext").not(".chkd").remove();
        $(".program .statesNext").not(".chkd").remove();
        readInputAlphabets();
    }

    var addAlphabet = function(a)
    {
        /*
        return if already exists
        */
        var attrs = $(".program .labelNext").map(function()
        {
            return $(this).attr("for");
        });
        for (var j = attrs.length - 1; j >= 0; j--)
        {
            if (attrs[j] == a)
            {
                $(".program .labelNext[for=\"" + attrs[j] + "\"]")
                    .addClass("chkd");
                $(".program .statesNext[for=\"" + attrs[j] + "\"]")
                    .addClass("chkd");
                return;
            }
        }
        /*
        add column if new
        */
        var html_th = "<th class=\"labelNext chkd\" for=\""
                    + a + "\">nxt(" + a + ")</th>";
        var html_td = "<td class=\"statesNext chkd\" for=\""
                    + a + "\"><input name=\"statesNext\" size=5/></td>";
        $(".program .statesTable .th_beforeHere").before(html_th);
        $(".program .statesTable .td_beforeHere").before(html_td);
    }
    $("button[name=\"okAlphabets\"]").on("click", function()
    {
        addAlphabets(readInputAlphabets());
    });
    $(".program input[name=\"alphabets\"]").on("focusout", function()
    {
        addAlphabets(readInputAlphabets());
    });
    $(".program input[name=\"alphabets\"]").on("keydown", function(e)
    {
        if (e.which == 13) addAlphabets(readInputAlphabets());
    });
    $(".program input[name=\"allowEpsilon\"]").on("change", function()
    {
        addAlphabets(readInputAlphabets());
    });

    /*
    add state
    */
    var addState = function(stateId, isInit, isFin)
    {
        readInputAlphabets();
        readInputStates();
        var html = "<tr class=\"state\"><td><input name=\"stateId\" size=1></input></td>";
        for (var i = 0; i < alphabets.length; i++)
        {
            html += "<td class=\"statesNext\" for=\""
                 +  alphabets[i] + "\"><input name=\"statesNext\" size=5/></td>";
        }
        html +=     "<td class=\"td_beforeHere\"></td>"
             +      "<td><input name=\"isInit\" type=\"radio\"></input></td>"
             +      "<td><input name=\"isFin\" type=\"checkbox\"></input></td>"
             +      "<td><button type=\"button\" name=\"rmvState\" style=\"width:30px\">-</button></td>"
             +      "<td class=\"stateNote\" id=\"notice\"></td>"
             + "</tr>";
        var stateNew = $("button[name=\"addState\"]").closest(".states")
            .find(".state").filter(":last").after(html).next();
        /*
        automatic allocattion of stateId
        */
        if (stateId !== undefined)
            stateNew.find("input[name=\"stateId\"]").val(stateId);
        else
        {
            loop: for (var i = 0; i < 100; i++)
            {
                for (var j = 0; j < states.length; j++)
                    if (i == Number(states[j]))
                        continue loop;
                stateNew.find("input[name=\"stateId\"]").val(i);
                break;
            }
        }
        /*
        set init / final
        */
        if (isInit !== undefined && isInit === true)
        {
            stateNew.find("input[name=\"isInit\"]").attr("checked", true);
        }
        if (isFin !== undefined && isFin === true)
        {
            stateNew.find("input[name=\"isFin\"]").attr("checked", true);
        }
        readInputStates();
    }
    $("button[name=\"addState\"]").on("click",function()
    {
        addState();
    });

    /*
    remove state
    */
    var removeState = function(stateId)
    {
        var state = $(".program .state[stateId=\"" + stateId + "\"]");
        if (state.find("input[name=\"isInit\"]").is(":checked"))
            notice(state.find("input[name=\"stateId\"]").val()
                   , "Initial state cannot be removed.");
        else
            state.remove();
        readInputStates();
    }
    $("button[name=\"rmvState\"]").live("click", function()
    {
        removeState($(this).closest(".state").attr("stateId"));
    });

    var exportToJSON = function()
    {
        return JSON.stringify
        ({
            alphabets : readInputAlphabets(),
            states    : readInputStates(),
            transFunc : readInputTransFunc(),
            stateInit : readInputStateInit(),
            statesFin : readInputStatesFin()
        });
    }
    $("button[name=\"export\"]").on("click", function()
    {
        $("input[name=\"export\"]").val(exportToJSON());
    });

    /*
    running test
    */
    var testRunning = function()
    {
        var word = $(".testRunning input[name=\"amInput\"]").val();
        var am = initAutomaton();
        var result = am_input(am, word);
        if (result)
            $(".testRunning .amInputResults").text("recognize.");
        else
            $(".testRunning .amInputResults").text("reject.");
        console.log("testRunning : " + word + " -> " + result.toString());
    }
    $(".testRunning button[name=\"amInput\"]").on("click", testRunning);
    $(".testRunning input[name=\"amInput\"]").on("keydown", function(e)
    {
        if (e.which == 13) testRunning();
    });

    /*
    define an instanse of myAutoMaton
    */
    var initAutomaton = function()
    {
        return new myAutoMaton
        (
            readInputAlphabets(),
            readInputStates(),
            readInputTransFunc(),
            readInputStateInit(),
            readInputStatesFin()
        );
    }

    var ParseAutomatonByString = function(am_string)
    {
        var am_json = JSON.parse(am_string);
        return new myAutoMaton
        (
            am_json.alphabets,
            am_json.states,
            am_json.transFunc,
            am_json.stateInit,
            am_json.statesFin
        );
    }

    var notice = function(stateId, msg, sec)
    {
        if (sec === undefined) sec = 3;
        readInputStates();
        $(".program .state[stateId=\"" + stateId + "\"] .stateNote").text(msg);
        var query = "$(\".program .state[stateId='" + stateId + "'] .stateNote\").text(\"\");";
        setTimeout(query ,sec * 1000);
    }

    /* 
    solve mondai2

    */
    var mondai2_fun = function()
    {
        var am = JSON.parse($(".mondai2 .tab input[name=\"amInput2-2\"]").val());
        var mondai2 = am_mondai2( am, parseInt( $(".mondai2 .tab input[name=\"amInput2-1\"]").val()));
        $(".mondai2 .tab .amInputResults2").text(mondai2);

    }
    $(".mondai2 button[name=\"solve2\"]").on("click",mondai2_fun);

    var determinize = function()
    {
        var am = ParseAutomatonByString($(".determinize input[name=\"amInputDeterminize\"]").val());
        return am.determinize();
    }
    $("button[name=\"solveDeterminize\"]").on("click", function()
    {
        $("input[name=\"ans_determinize\"]").val(JSON.stringify(determinize()));
    });

    var minimize = function()
    {
        var am = ParseAutomatonByString($(".minimize input[name=\"amInputMinimize\"]").val());
        return am.minimize();
    }
    $("button[name=\"solveMinimize\"]").on("click", function()
    {
        $("input[name=\"ans_minimize\"]").val(JSON.stringify(minimize()));
    });

    addAlphabets(readInputAlphabets());
});

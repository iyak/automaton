var unique = function(array)
{
    var storage = {};
    var uniqueArray = [];
    for (var i = 0; i < array.length; i++)
        if (!(array[i] in storage))
        {
            storage[array[i]] = true;
            uniqueArray.push(array[i]);
        }
    return uniqueArray;
}

var powerSet = function(a, i, j)
/*
require set (array)
return its power set (array of arrays)
*/
{
    if (i === undefined) i = 0;
    if (j === undefined) j = a.length - 1;
    if (i > j) return [[]];
    var subsets = powerSet(a, i + 1);
    return subsets.concat(subsets.map(function(x)
    {return x.concat(a[i]);}));
}

var formatStateSet = function(a)
{
    if (a.length == 0) return "Φ";
    return a.sort().join("|");
}

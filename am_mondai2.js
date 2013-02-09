var am_mondai2 = function(am, n)
// amが受領する長さnのワードの個数
{
	var words = [];
	var letter_number = am.alphabets.length;
	var k = 0;

	for(var i = 0; i < letter_number; i++)
		// wordsにアルファベットを入れる
		words.push(am.alphabets[i]);


	while(1){
		var word = words.shift();

		if(word.length >= n){
			// 先頭までn文字のものが来たら終了
			words.unshift(word)
			break;
		}

		for(var i = 0; i < letter_number; i++){
			words.push(word + am.alphabets[i]);
		}
	}

	for(var i = 0; i < words.length; i++){
		if(am_mondai1(am,words[i]))
			k++;
	}

	return k;

}
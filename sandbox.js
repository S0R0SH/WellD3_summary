$(document).ready(function(){

	console.log("in Sandbox");


	d3.text("day.txt").get(function(error, data){

		console.log(data)

		var myTabPositions = [];
		var myNewLinePositions = [];

		var tabVal = "\\b\t\\b";
		var tabMod = 'g';
		var tabRegExp = new RegExp(tabVal, tabMod);

		console.log(tabRegExp)

		var lineVal = "\\b\n\\b";
		var lineMod = 'g';
		var lineRegExp = new RegExp(tabVal, tabMod);

		console.log(lineRegExp)

		data.replace(tabRegExp, function(a, b){
			console.log("a ", a);
			myTabPositions.push(b); return a;
		})

		data.replace(lineRegExp, function(a, b){ myNewLinePositions.push(b); return a; })

		console.log(myTabPositions)
		console.log(myNewLinePositions)

	})

});


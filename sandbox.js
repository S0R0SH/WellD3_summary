
	var testData = [
		[ 60, {"G":20, "S":40, "Y":40}],
		[ 70, {"G":30, "C":20, "Y":50}],
		[ 80, {"G":30, "C":20, "Y":50}],
		[ 90, {"G":30, "C":20, "Y":50}],
		[ 100, {"G":30, "C":20, "Y":50}],
		[ 110, {"G":30, "C":20, "Y":50}],
		[ 120, {"G":30, "C":20, "Y":50}],
		[ 130, {"G":30, "C":20, "Y":50}],
		[ 140, {"G":30, "C":20, "Y":50}],
		[ 150, {"G":30, "C":20, "Y":50}],
		[ 160, {"G":30, "C":20, "Y":50}],
		[ 170, {"G":30, "C":20, "Y":50}],
		[ 180, {"G":30, "C":20, "Y":50}],
		[ 190, {"G":30, "C":20, "Y":50}],
		[ 200, {"G":30, "C":20, "Y":50}]
	];

	var lith = [220, {"G":30, "C":20, "Y":50}]
	var lithObj = lith[1]
	// console.log(lith[1])

	// console.log(lith[1].hasOwnProperty('G'))

	var avgLith = {};

	testData.forEach(function(d){
		lithObj = d[1]
		for (sym in lithObj) {
			// if lithObj does not already have the symbol then create it
			if (!avgLith.hasOwnProperty((sym))){
				avgLith[sym] = lithObj[sym];
				// if the symbol exists then add percentage to it
			} else {
				console.log(lithObj[sym])
				avgLith[sym] += lithObj[sym];
			}
		}

	})


	console.log(avgLith)





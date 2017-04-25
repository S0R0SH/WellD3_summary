$(document).ready(function(){

	var testData = [
		[ 60, {"G":20, "S":40, "Y":40}],
		[ 70, {"G":30, "C":20, "Y":50}],
		[ 80, {"G":50, "C":10, "Y":40}],
		[ 90, {"G":60, "C":20, "Y":20}],
		[ 100, {"G":10, "C":30, "Y":60}],
		[ 110, {"G":90, "C":10, "Y":0}],
		[ 120, {"G":60, "C":30, "Y":10}],
		[ 130, {"G":60, "C":10, "Y":30}],
		[ 140, {"G":30, "C":60, "Y":10}],
		[ 150, {"G":60, "C":20, "Y":20}],
		[ 160, {"G":80, "C":10, "Y":10}],
		[ 170, {"G":20, "C":70, "Y":10}],
		[ 180, {"G":10, "C":70, "Y":20}],
		[ 190, {"G":50, "C":10, "Y":40}],
		[ 200, {"G":60, "C":20, "Y":20}]
	];

	var testLith = [ 100, {"C":20, "G":40, "Y":40}]


	var boxWidth = 100;
	var lithSvg = d3.select('.lith').append('svg')

	testData.forEach(function(d){

		var row = d[1];

		var xPosition = 0;

		for (var sym in row) {
			lithSvg.append('rect')
				.attr('x', xPosition)
				.attr('y', d[0])
				.attr('width', (boxWidth * (row[sym])/100))
				.attr('height', 10)
				.attr('class', sym);

			xPosition += boxWidth * (row[sym])/100
		}
	})

});



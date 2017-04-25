$(document).ready(function(e){
	console.log('ready')

	// height
	// width
	// numOfCirclesY
	// numOfCirclesX
	// radius

	var diameter = 16.6666666;

	makeChert(diameter);

	function makeChert(diam){

		var rad = diam / 2;
		var height = 50;
		var width = height * 4;

		var rows = height/diam;
		var cols = width/diam;

		var chert2 = d3.select('.shapes').append('svg')
			.attr('id', 'chert2');
			// .attr('height', height)
			// .attr('width', width)


		var box = chert2.append('rect')
			.attr('height', height)
			.attr('width', width)
			.attr('fill', '#F2DEA3')
			.attr('fill-opacity', .5);

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 13; j++) {
			box.append('circle')
				.attr('cx', function(){
					if (i % 2 == 1) {
						return (j*diam)
					} else {
						return (j*diam) + rad
					}
				})
				.attr('cy', (i*diam) + rad)
				.attr('r', rad)
				.attr('stroke', 'black')
				.attr('stroke-width', .2)
				.attr('fill', 'none')

		}

	}
	}

	// var chert3 = d3.select('.shapes').append('svg')
	// 		.attr('id', 'chert3');

	// var rectHeight = 50;
	// var rectWidth = rectHeight * 4;

	//  chert3.append('rect')
	// 	.attr('height', rectHeight)
	// 	.attr('width', rectWidth)
	// 	.attr('fill', '#F2DEA3')
	// 	.attr('fill-opacity', .5);

	// for (var i = 0; i < 3; i++) {

	// 	for (var j = 0; j < 12; j++) {
	// 		chert3.append('circle')
	// 			.attr('cx', (j * rectWidth / 6) + rectWidth / 6)
	// 			.attr('cy', (i * rectHeight / 3) + rectHeight / 6)
	// 			.attr('r', 8.3333333)
	// 			.attr('stroke', 'black')
	// 			.attr('stroke-width', .4)
	// 			.attr('fill', 'none')

	// 	}

	// }




})




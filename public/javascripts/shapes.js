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

// <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
//   <defs>
//     <clipPath id="cut-off-bottom">
//       <rect x="0" y="0" width="200" height="100" />
//     </clipPath>
//   </defs>

//   <circle cx="100" cy="100" r="100" clip-path="url(#cut-off-bottom)" />
// </svg>

var svg = d3.select('.rect').append('svg')
	// .attr('height', 500)
	// .attr('width', 500)

svg.append('clipPath')
  	.attr('id', 'clipped')
  	.append('rect')
  		.attr('x', 0)
  		.attr('y', 0)
  		.attr('width', 30)
  		.attr('height', 100)

svg.append('svg:image')
	.attr('xlink:href', 'liths/G.svg')
	.attr('x', '0')
	.attr('y', '0')
	.attr('clip-path', 'url(#clipped)')

// svg.append('circle')
// 	.attr('cx', '100')
// 	.attr('cy', '100')
// 	.attr('r', '100')
// 	.attr('clip-path', 'url(#clipped)')



		// .append("svg:image")
  // 		.attr("xlink:href", "liths/greenstone.svg")
  // 		.attr("xlink:href", "liths/greenstone.svg")
		// 	.attr('x', 0)
		// 	.attr("y", 0)
		// 	.attr('width', 50)
		// 	.attr('height', 20)

// svg.append("rect")
// 		.attr('width', 20)
// 		.attr('height', 50)
// 		.attr('stroke', 'black')
// 		.attr("fill", "none")
// 		.attr('clip-path', 'url(#clipped');



})




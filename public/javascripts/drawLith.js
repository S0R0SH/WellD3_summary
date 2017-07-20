// Put in lith function
function drawLith(lithColumn, yScale, columnWidth, lith){
	console.log("In Draw Lith")
	console.log(tempLith)

	var maxDepth = d3.max(lith, function(d) { return d[0]; });
	var yOffset = .5;


	var lithSvg = lithColumn.append('svg')
		.attr('x', 0)
		.attr('y', 0)
		.attr('height', yScale(maxDepth))
		.attr('width', columnWidth)
		// .attr('viewBox', `0 0 ${columnWidth} 830`)
			// .append('rect')
			// 	.attr('width', columnWidth)
			// 	.attr('height', 830)
			// 	.attr('class', 'border')
			// 	.attr('fill', 'none')
			// 	.attr("stroke-width", 2)
			// 	.attr("stroke", 'green')

	var xPos = 0;
	tempLith.forEach(function(d, i) {

		lithSvg.append('svg:clipPath')
			.attr('id', 'clipped')
			.append('rect')
			.attr('x', 0)
			.attr('y', yScale(d.depth))
			.attr('width', columnWidth * i / 10 )
			.attr('height', yScale(100))
			.attr('fill', 'red');

		lithSvg.append('svg:image')
				.attr('xlink:href', `/images/lith/I.svg` )
				.attr('x', 0)
				.attr('y', d.depth)
				.attr('width', columnWidth)
				.attr('height', yScale(100))
				.attr('preserveAspectRatio', 'none')
				.attr('class', 'lith')
				.attr('clip-path', 'url(#clipped)');

		xPos += 20;


		lithSvg = lithColumn.append('svg')
			.attr('x', 0)
			.attr('y', 0)
			.attr('height', yScale(maxDepth))
			.attr('width', columnWidth)
			// .attr('viewBox', `0 0 ${columnWidth} 830`)
			// .attr('preserveAspectRatio', "none");

		lithSvg.append('svg:image')
			.attr('class', 'Hello')
			.attr('xlink:href', `/images/lith/I.svg` )
			.attr('x', 0)
			.attr('y', yScale(d.depth))
			.attr('width', i * 15 + 5 )
			.attr('height', yScale(100))
			.attr('preserveAspectRatio', "none");
	});



	var lithContainer;

	lith.forEach(function(d){
		var depth = d[0];
		var syms = d[1];
		var percents = d[2];
		var xPosition = 0;

		// console.log(d)


		for (var i = 0; i < percents.length; i++) {
			// append clipPath to svg
			// give clipPath an id
			// append rect to clipPath
			// give rect attrs based on lith data
			// console.log(xPosition)


			lithSvg.append('svg:clipPath')
				.attr('id', 'clipped')
				.append('svg')
					.attr('x', xPosition)
					.attr('y', function(d){
						if (depth % 100 === 0) {
							return yScale(depth - 100) + yOffset
						} else {
							return yScale((Math.ceil(depth/100) * 100) - 100) + yOffset
						}
					})
					.attr('width', (columnWidth * (percents[i]) / 100) )
					.attr('height', yScale(100));

			// append svg:image to svg
			// set x & y to 0
			// set clip-path, attr to id of rect
			lithSvg.append('svg:image')
				.attr('xlink:href', function(){ return `/images/lith/${syms[i]}.svg` })
				.attr('x', 0)
				.attr('y', function(){
					if (depth % 100 == 0) {
						return yScale(depth - 100) + yOffset
					} else {
						return yScale((Math.ceil(depth/100) * 100) - 100) + yOffset
					}
				})
				.attr('width', columnWidth)
				.attr('height', yScale(100))
				.attr('preserveAspectRatio', 'none')
				.attr('class', 'lith')
				.attr('clip-path', 'url(#clipped)');

			xPosition += columnWidth * (percents[i])/100

		}
	})


}
// end of lith function

function drawLithologies(){
	console.log("Drawing lithologies")
}








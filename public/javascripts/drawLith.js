// Put in lith function
function drawLith(lithColumn, yScale, columnWidth, lith){

	var maxDepth = d3.max(lith, function(d) { return d[0]} );
	var yOffset = .5;

	var lithSvg = lithColumn.append('svg')
		.attr('x', 0)
		.attr('height', yScale(maxDepth))
		.attr('width', columnWidth);

	lith.forEach(function(d){

		var depth = d[0];
		var syms = d[1];
		var percents = d[2];
		var xPosition = 0;

		for (var i = 0; i < percents.length; i++) {

			// append clipPath to svg
			// give clipPath an id
			// append rect to clipPath
			// give rect attrs based on lith data

			lithSvg.append('clipPath')
				.attr('id', 'clipped')
				.append('rect')
					.attr('x', xPosition)
					.attr('y', function(d){
						if (depth % 100 == 0) {
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
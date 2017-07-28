// var MakeLithologies = function(svg, scale, dataObj){
// 	this.svg = svg;
// 	this.dataObj = dataObj;

// 	// console.log(dataObj)

// 	var svgWidth = svg.attr('width');
// 	var xScale = scale.x;
// 	var yScale = scale.y;
// 	var yOffset = .5;
// 	const depth = yScale(dataObj.depth - 100)
// 	var xStart = 0;
// 	var percent;

// 	// console.log('yScale', depth)



// 	var borders = {
// 		on: false,
// 		width: .25,
// 		color: 'black'
// 	}

// 	for(lithName in dataObj){

// 		if(lithName !== 'depth' && dataObj[lithName] !== 0){
// 			// console.log(lithName)
// 			// debugger
// 			percent = dataObj[lithName];

// 			//if the lith symbol doesnt exist in the library, use 'default'
// 			if(!lithSymbols.hasOwnProperty(lithName)){
// 				lithName = 'default'
// 			}

// 			drawLithSquare(lithName, xStart);
// 			xStart += percent;
// 		}
// 	}

// 	function drawLithSquare(lithName, xPos){

// 		var numFloored = Math.floor(percent)
// 		var numCeiling = Math.ceil(percent)
// 		var numDecimal = percent - numFloored;

// 		for(var i = 0; i < numCeiling; i++){
// 			createSymbol(i * 10, lithSymbols[lithName], xPos, percent);
// 		}
// 	}

// 	function createSymbol(xOffset, lithSymbol, xPos, perc){
// 		// console.log(lithSymbol)
// 		x1 = xScale(xOffset);
// 		xPos  = xScale(xPos);
// 		var lithWidth = xScale(perc);
// 		// console.log('lith width:', lithWidth)

// 		var symbol = svg.append("rect")
// 			.attr('x', xPos + x1)
// 			.attr('y', depth + yOffset)
// 			.attr('width', xScale(10))
// 			.attr('height', yScale(100))
// 			.attr('fill', lithSymbol.fill)
// 			.attr('stroke-width', function(){
// 				if(borders.on){
// 					return borders.width
// 				} else {
// 					return lithSymbol.borderWidth;
// 				}
// 			})
// 			.attr('stroke', function(){
// 				if(borders.on){
// 					return borders.color;
// 				} else {
// 					return lithSymbol.borderColor;
// 				}
// 			})
// 			.attr('opacity', 1);


// 		var pattern = svg.append('path')
// 			.attr('width', xScale(svgWidth))
// 			.attr('transform', `translate(${(xPos + x1)}, ${depth}) scale(${xScale(.1)}, ${yScale(1)}) translate(0, 10)`)
// 			.attr('stroke-width', lithSymbol.lineThickness)
// 			.attr("stroke", lithSymbol.lineColor)
// 			.attr('d', lithSymbol.pattern )
// 	}

// }

var MakeLithologiesArray = function(svg, scale, lithData){
	this.svg = svg;
	this.lithData = lithData;

	// console.log(lithData[0])

	var svgWidth = svg.attr('width');
	var xScale = scale.x;
	var yScale = scale.y;
	var yOffset = .5;
	const depth = yScale(lithData[0] - 1)
	var symbol = lithData[1];
	var percents = lithData[2];

	var borders = {
		on: false,
		width: .25,
		color: 'black'
	}

			// for reference:
			// sampleArrayToIterate =
			// [500,
			// ['F', 'X', 'G', 'C', 'T', 'D', 'I', 'L', 'A', 'S', 'Y', 'B'],
			// [ 20,  0,   40,  0,   0,   0,   30,  0,   10,  0,   0,   0 ]];

	// console.log(lithSymbols["G"])

	// iterate through lith array
		var i = 0;
		var xStart = 0;
		percents.forEach(function(percent){

		if(percent !== 0){

	// lithSymbols defines shape, color, etc of symbol. In 'lithologies.js'

	// if the lith symbol doesnt exist in the library, use 'default'

			if(!lithSymbols.hasOwnProperty(symbol[i])){
				lithName = 'default'
			} else {
				lithName = symbol[i]
			}

			drawLithSquare(lithName, xStart, percent);
			xStart += percent;
		}
		i++;
	})

	function drawLithSquare(lithName, xPos, percent){

		// console.log(lithName)

		var numFloored = Math.floor(percent)
		var numCeiling = Math.ceil(percent)
		var numDecimal = percent - numFloored;

		for(var i = 0; i < numCeiling; i++){
			createSymbol(i * 10, lithSymbols[lithName], xPos, percent);
		}
	}

	function createSymbol(xOffset, lithSymbol, xPos, perc){
		// console.log(lithSymbol)
		x1 = xScale(xOffset);
		xPos  = xScale(xPos);
		var lithWidth = xScale(perc);
		// console.log('lith width:', lithWidth)

		// Add the background color to lith symbol
		var symbol = svg.append("rect")
			.attr('x', xPos + x1)
			.attr('y', depth + yOffset)
			.attr('width', xScale(10))
			.attr('height', yScale(100))
			.attr('fill', lithSymbol.fill)
			.attr('stroke-width', function(){
				if(borders.on){
					return borders.width
				} else {
					return lithSymbol.borderWidth;
				}
			})
			.attr('stroke', function(){
				if(borders.on){
					return borders.color;
				} else {
					return lithSymbol.borderColor;
				}
			})
			.attr('opacity', 1);

		// Add the pattern to the symbol
		var pattern = svg.append('path')
			.attr('width', xScale(svgWidth))
			// .attr('height', yScale(200))
			.attr('transform', `translate(${(xPos + x1)}, ${depth}) scale(${xScale(.1)}, ${yScale(1)}) translate(0, 10)`)
			.attr('stroke-width', lithSymbol.lineThickness)
			.attr("stroke", lithSymbol.lineColor)
			.attr('d', lithSymbol.pattern )
	}
}










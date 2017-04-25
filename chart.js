$(document).ready(function(){

	var margin = 10;
	var pageHeight = 1000;
	var chartHeight = pageHeight - (margin * 2);
	var pageWidth = 750;
	var chartWidth = pageWidth - (margin * 2);
	var maxDepth = d3.max(depth_data, function(d) { return d[0]} );
	var data = depth_data_summary;
	var textSize = 12;

	var depthColDimension = { height: chartHeight, width: (chartWidth * 0.066667) };
	var lithColDimension  = { height: chartHeight, width: (chartWidth * 0.100000) };
	var minColDimension   = { height: chartHeight, width: (chartWidth * 0.100000) };
	var descColDimension  = { height: chartHeight, width: (chartWidth * 0.600000) };
	var trackColDimension = { height: chartHeight, width: (chartWidth * 0.133333) };

	var columnDimensions = [
								depthColDimension,
								lithColDimension,
								minColDimension,
								descColDimension,
								trackColDimension
	];

	// test: do column widths / total width = 1?
	columnWidthsEqual1(columnDimensions, chartWidth);

	var ropScale = createScale([0, trackColDimension.width], [200, 0])

	// call create scale function for these
	var wobScale = d3.scaleLinear()
		.range([0, trackColDimension.width])
		.domain([0, 200]);

	var lithScale = d3.scaleLinear()
		.range([0, lithColDimension.width])
		.domain([0, 100]);

	var xScale = d3.scaleLinear()
		.range([0, pageWidth])
		.domain([0, 200]);

	var mudScale = d3.scaleLinear()
		.range([0, trackColDimension.width/4])
		.domain([200, 600]);

	var yScale = d3.scaleLinear()
		.range([0, chartHeight])
		.domain([0, maxDepth + 100]);

	var group = d3.select("#svg-container")
		.attr('width', pageWidth)
		.append('g')

	var svg = d3.select('g')
		.append('svg')
		.attr('height', pageHeight)
		.attr('width', pageWidth)
		.attr('class', 'main')
		.append('g')
			.attr('id', 'svg-group')
			.attr("transform", "translate(10, 10)");

	var depthColumn  = createColumn(chartHeight, depthColDimension.width, 0, 0);
	var lithColumn   = createColumn(chartHeight, lithColDimension.width, depthColDimension.width, 0);
	var minColumn    = createColumn(chartHeight, minColDimension .width, lithColDimension.width + depthColDimension.width, 0);
	var descColumn   = createColumn(chartHeight, descColDimension.width, minColDimension.width + lithColDimension.width + depthColDimension.width, 0);
	var tracksColumn = createColumn(chartHeight, trackColDimension.width, descColDimension.width + minColDimension.width + lithColDimension.width + depthColDimension.width, 0);

	var fullPage = createColumn(chartHeight, pageWidth, 0, 0);

	var columns = [depthColumn, lithColumn, minColumn, descColumn, tracksColumn];

	columns.forEach(function(d, i){
		createBorder(d, columnDimensions[i].width, chartHeight, 1.5)
	})

	createBorder(svg, chartWidth, chartHeight, 1);

	var ropTrack = d3.line()
		.x(function(d) { return ropScale(d[1]) })
		.y(function(d) { return yScale(d[0]) })
		// .curve(d3.curveStepAfter)
		.curve(d3.curveCardinal);

	var mudTrack = d3.line()
		.x(function(d) { return mudScale(d[7]) })
		.y(function(d) { return yScale(d[0]) })
		// .curve(d3.curveStepAfter);

	var wobTrack = d3.line()
		.x(function(d) { return wobScale(d[2]) })
		.y(function(d) { return yScale(d[0]) })

	for (var i = 0; i < 5; i++ ){
		if (i === 3 || i === 0) { continue };
		addHorizontalGridlines(columns[i], yScale, columnDimensions[i].width, chartHeight)
	}

	depthColumn.append('g')
		.attr('transform', "translate(17, 1)")
		.attr('class', 'depth-label')
		.call(createYGridlines(yScale, 0, chartHeight))

	d3.selectAll(".y-axis .tick line")
		.attr("opacity", function(d){ return (d%500 === 0)  ?  ".75" : ".25" })
		.attr("stroke-width", function(d){ return (d%500 === 0 ) ?  "1" : ".25" })

	d3.selectAll(".tick text")
		.attr("visibility", function(d){ return (d%500 === 0)  ?  "visible" : "hidden" })
		.attr("stroke-width", function(d){ return (d%500 === 0 ) ?  "1" : ".25" })

	// Draw data tracks
	var ropPath = drawTrack(tracksColumn, data, ropTrack, "firebrick", 1);
	var wobPath = drawTrack(tracksColumn, data, wobTrack, "midnightblue", 1);

	var ropTotalLength = ropPath.node().getTotalLength();
	var wobTotalLength = wobPath.node().getTotalLength();

	// time it takes for tracks to animate
	var timeLength = 10;

	var easing = [
		d3.easeElastic, d3.easeBounce, d3.easeLinear,
		d3.easeSin, d3.easeQuad, d3.easeCubic, d3.easePoly,
		d3.easeCircle, d3.easeExp, d3.easeBack
		];

	animateLine(ropPath, ropTotalLength, timeLength, easing[4])
	animateLine(wobPath, wobTotalLength, timeLength, easing[4])

	var text = writeText(desMsg, descColumn, yScale, textSize);

	const type = d3.annotationCallout

	const annotation = [{
		note: { label: "Annotate what is happening at 1000ft"},
		x: xScale(0),
		y: yScale(1000),
		dy: yScale(-100),
		dx: xScale(20),
		connector: { "end": "arrow" }
	},
	{
		x: 0,
		y: yScale(2500),
		dx: xScale(20),
		dy: yScale(-100),
		connector: { "end": "arrow" },
		subject: { "radius": 140.31076794375 },
		note: { "label": "This note is customizable" }
	}]

	const makeAnnotations = d3.annotation()
		.editMode(true)
		.type(type)
		.annotations(annotation)

		descColumn.append("g")
			.attr("class", "annotation")
			.call(makeAnnotations)

	// addLith(selector, depth, w, h, color)
	// for (var i = 0; i < 5000; i += 100) {
	// 	// addLith(lithColumn, yScale(i), lithColDimension.width, yScale(100), getRandomColor())
	// }

	console.log(lithColDimension.width, yScale(100))

	var gs = insertSymbol(".liths", 'liths/greenstone')
	var serp = insertSymbol(".liths", 'liths/serp')
	var chert = insertSymbol(".liths", 'liths/chert')
	var argillite = insertSymbol(".liths", 'liths/arg')
	var gw = insertSymbol(".liths", 'liths/gw')
	var blueschist = insertSymbol(".liths", 'liths/blueschist')

	var logo = insertSymbol(".logo", 'img/logo')

	var lithArr = [];

	var lithData = lith.forEach(function(d){
		lithArr.push(formatLithData(d))
	})

	// console.log(lithArr[55])

	var lith100 = getAvgLith(lithArr);

	// console.log(lith100)

	// lith100.forEach(function(d){
	// 	console.log(d[0],d[1])
	// });


	function makeLine() {
		d3.select('line')
			.attr('x1', 5)
			.attr('y1', 200)
			.attr('x2', 300)
			.attr('y2', 700)
			.attr('stroke-width', 5)
			.attr('stroke', 'blue')
	}

		var totalDepth = d3.max(data, function(d) { return d[0]; })
		console.log('td', totalDepth)

		var boxWidth = 100;
		var lithSvg = lithColumn.append('svg').attr('height', yScale(totalDepth))
		var yOffset = .5;
		lith100.forEach(function(d){

			var row = d[1];

			var xPosition = 0;

			for (var sym in row) {
				lithSvg.append('rect')
					.attr('x', xPosition)
					.attr("y", function(){
							if (d[0]% 100 == 0) {
								return yScale(d[0] - 100) + yOffset
							} else {
								return yScale((Math.ceil(d[0]/100) * 100) - 100) + yOffset
							}
					})
					.attr('width', (lithColDimension.width * (row[sym])/100))
					.attr('height', yScale(100))
					.attr('class', `${sym} lith`);

				xPosition += lithColDimension.width * (row[sym])/100
		}


			// var totalDepth = d3.max(d, function(d) { return d[0]} );

			// lithColumn.append('svg')
			// 	.attr('height', yScale(totalDepth))
			// 	.attr('width', function(){
			// 		if (d[1]['G']) {
			// 			return lithScale(d[1]['G'])
			// 		} else {
			// 			return 0
			// 		}
			// 	})
			// .append('g')
			// 	.attr('height', yScale(100))
			// 	.attr('fill', 'red')
			// 	.append("image")
			// 		.attr("xlink:href", 'liths/gsLarge.svg')
			// 		.attr("x", 0)
			// 		.attr("y", function(){
			// 			if (d[0]% 100 == 0) {
			// 				return yScale(d[0] - 100)
			// 			} else {
			// 				return yScale((Math.ceil(d[0]/100) * 100) - 100)
			// 			}
			// 		})
			// 		.attr("height", yScale(100))
			// 		.attr("width", lithColDimension.width)
		})

	// lithColumn.append('svg')
		//   	.attr('width', 50)
		//   	.attr('height', yScale(100))
		// 	  .append("image")
		// 	  	.data([lith100])
		// 			.attr("xlink:href", 'liths/graywacke.png')
		// 			.attr("x", function(d){console.log(d[0])})
		// 			.attr("y", "1")
		// 			.attr("width", lithColDimension.width)
		// 			.attr("height", yScale(100));
});




function testAverageLith(lithObj){
	var total = 0;

	for (percentage in lithObj) {
		total += lithObj[percentage];
	}

	return total;
}

function insertSymbol(selector, symbol) {
	d3.select(selector)
		.append('div')
			.attr('class', symbol)
			.attr('overflow', 'hidden')
		.append('img')
			.attr('src', symbol + ".svg")
			// .style('border', '1px solid black')
			.attr('width', '50%')
			.attr('margin', '-50')

	}

function formatLithData(lith) {
	var depth = lith[0];
	var sym = lith[1][0];
	var count = lith[1][1];
	var arr = [depth];

	// console.log(depth, sym, count)
	var i = 0;
	var lithObj = {};
	// lithObj['depth'] = depth;
	var obj = {};
	sym.forEach(function(d){
		obj[d] = count[i]
		// arr.push(obj)
		i++;
	})
	arr.push(obj)
	return arr;
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function addLith(selector, depth, w, h, color) {
	selector.append('rect')
		.attr('width', w)
		.attr('height', h)
		.attr('x', 0)
		.attr('y', depth)
		.attr('class', 'lith')
		.attr('fill', color)
		.attr("stroke-width", 0)
		.attr("stroke", "#B3B7B7")
}

function animateLine(path, lineLength, timeLength,easeStyle){
		path
		.attr("stroke-dasharray", lineLength + " " + lineLength)
		.attr("stroke-dashoffset", lineLength)
		.transition()
			.duration(timeLength)
			.ease(easeStyle)
			.attr("stroke-dashoffset", 1)
			// .attr("stroke-dasharray", "4, 2" );
}

function addHorizontalGridlines(column, yScale, width, height) {
		column.append('g')
			.attr('class', 'y-axis')
			.call(createYGridlines(yScale, width, height))
}


// tests ======================================

// do column widths = 1?
function columnWidthsEqual1(columns, chartWidth){
	var w = 0;
	columns.forEach(function(d){
		w += d.width/chartWidth
	})
	console.log("Column widths = 1: ", w === 1)
}










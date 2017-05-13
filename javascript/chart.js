$(document).ready(function(){

	// URLS
	// var depthDataURL = 'http://localhost:3000/wells/1/depth_data'
	var wellNames = [];

	function get_well_names(){
		var results = null

		$.ajax({
			url: "http://localhost:3001/wells/well_names",
			method: 'GET'
		}).done(function(data){
			results = data;
		});

		return results;
	}
	var names = get_well_names();
	// var names = "http://localhost:3001/wells/well_names"
	console.log('names', names)

	var margin = 10;
	var pageHeight = 1000;
	var headerHeight = 150;
	var chartHeight = pageHeight - headerHeight - (margin * 2);
	var pageWidth = 750;
	var chartWidth = pageWidth - (margin * 2);
	// var maxDepth = d3.max(depthData, function(d) { return d.depth} );
	// var data = depth_data_summary;
	var pageTextSize = 10;

	var headerDimension   = { height: headerHeight, width: chartWidth };
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
		.range([0, trackColDimension.width / 4])
		.domain([200, 600]);

	var tempOutScale = d3.scaleLinear()
		.range([0, trackColDimension.width])
		.domain([0, 200]);

	var svg = d3.select('#svg-container')
		.append('svg')
		.attr('height', pageHeight)
		.attr('width', pageWidth)
		.attr('class', 'main')
		.append('g')
			.attr('id', 'svg-group')
			.attr("transform", `translate(${10}, ${10})`);

	var headerSvg  = createColumn(headerDimension.height, chartWidth, 0, 0);

	var depthColumn  = createColumn(depthColDimension.height, depthColDimension.width, 0, headerHeight);
	var lithColumn   = createColumn(lithColDimension.height, lithColDimension.width, depthColDimension.width, headerHeight);
	var minColumn    = createColumn(minColDimension.height, minColDimension .width, lithColDimension.width + depthColDimension.width, headerHeight);
	var descColumn   = createColumn(descColDimension.height, descColDimension.width, minColDimension.width + lithColDimension.width + depthColDimension.width, headerHeight);
	var tracksColumn = createColumn(trackColDimension.height, trackColDimension.width, descColDimension.width + minColDimension.width + lithColDimension.width + depthColDimension.width, headerHeight);

	var fullPage = createColumn(chartHeight, pageWidth, 0, 0);

	var columns = [depthColumn, lithColumn, minColumn, descColumn, tracksColumn];

	columns.forEach(function(d, i){
		createBorder(d, columnDimensions[i].width, chartHeight, 1.5)
	})

	createBorder(headerSvg, chartWidth, headerHeight, 1.5);

  ////////////////////////////////////////////////////////////////////

	var wellData = [];
	var depthDataUrl = 'http://localhost:3001/wells/well_data?well_num=1'

	d3.json(depthDataUrl, function (d) {
		var wellData = d.data.attributes;

		var parseTime = d3.timeParse("%d-%b-%y");

		var wellName = wellData.name
		var date1 = new Date(wellData['start-date']);
		var date2 = new Date(wellData['end-date']);
		var startDate = `${date1.getMonth() + 1}/${date1.getDay()}/${date1.getFullYear()}`
		var endDate = `${date2.getMonth() + 1}/${date2.getDay()}/${date2.getFullYear()}`;

		// depthData is an array of objects
		var depthData = wellData['depth-data']

		var maxDepth = d3.max(depthData, function(d) { return d.depth } );

		var yScale = d3.scaleLinear()
			.range([0, chartHeight])
			.domain([0, maxDepth + 100]);

		var ropTrack = d3.line()
			.x(function(d) { return ropScale(d.rop) })
			.y(function(d) { return yScale(d.depth) })
			// .curve(d3.curveStepAfter)
			.curve(d3.curveStepAfter);

		console.log(depthData[5].rop)
		console.log('Start Date: ', startDate)
		console.log('End Date: ', endDate);

		console.log('1: ', maxDepth)

		var wobTrack = d3.line()
			.x(0)
			.x(function(d) { return wobScale(d.wob) })
			.y(function(d) { return yScale(d.depth) })

		var tempOutTrack = d3.line()
			.x(0)
			.x(function(d) { return tempOutScale(d.temp_out) })
			.y(function(d) { return yScale(d.depth) })

		for (var i = 0; i < 5; i++ ){
			if (i === 3 || i === 0) { continue };
			addHorizontalGridlines(columns[i], yScale, columnDimensions[i].width, chartHeight)
		}

		depthColumn.append('g')
			.attr('transform', "translate(17, 1)")
			.attr('class', 'depth-label')
			.call(createYGridlines(yScale, 0, chartHeight))

		d3.selectAll(".y-axis .tick line")
			.attr("opacity", function(d){ return (d % 500 === 0)  ?  ".75" : ".25" })
			.attr("stroke-width", function(d){ return (d%500 === 0 ) ?  "1" : ".25" })

		d3.selectAll(".tick text")
			.attr("visibility", function(d){ return (d % 500 === 0)  ?  "visible" : "hidden" })
			.attr("stroke-width", function(d){ return (d % 500 === 0 ) ?  "1" : ".25" })

		// Draw data tracks
		var ropPath = drawTrack(tracksColumn, depthData, ropTrack, "blue", 1);
		var wobPath = drawTrack(tracksColumn, depthData, wobTrack, "black", 1);
		var tempOutPath = drawTrack(tracksColumn, depthData, tempOutTrack, "red", 1);

		var ropLength = ropPath ? ropPath.node().getTotalLength() : 9999;
		var wobLength = wobPath ? wobPath.node().getTotalLength() : 9999;
		var tempOutLength = tempOutPath ? tempOutPath.node().getTotalLength() : 9999;


		// time it takes for tracks to animate
		var timeLength = 1000;

		var easing = [
			d3.easeElastic, d3.easeBounce, d3.easeLinear,
			d3.easeSin, d3.easeQuad, d3.easeCubic, d3.easePoly,
			d3.easeCircle, d3.easeExp, d3.easeBack
			];

		animateLine(ropPath, ropLength, timeLength, easing[4])
		animateLine(wobPath, wobLength, timeLength, easing[4])
		animateLine(tempOutPath, tempOutLength, timeLength, easing[4])

		var text = writeText(desMsg, descColumn, yScale, pageTextSize);

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

	var lithArr = [];

	var liths = d.data.attributes.lithologies;

	// console.log(liths)

	// console.log(lith)
	var lithData = lith.forEach(function(d){
		lithArr.push(formatLithData(d))
	})

	var lithObj = d.data.attributes.lithologies;

	var newLith = toLithArray(lithObj);

	console.log(avgLithArray(newLith))


	// console.log('newLith', newLith)
	// console.log()

	var lith100 = getAvgLith(lithArr);

	var lith100Arr = getAvgLithArray(lithArr);

	// lith100Arr.forEach(function(d){
	// 	// console.log(d[0], d[1])
	// })


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

		var boxWidth = 100;
		var lithSvg = lithColumn.append('svg').attr('height', yScale(maxDepth))
		var yOffset = .5;

		lith100.forEach(function(d){

			var row = d[1];

			var xPosition = 0;

			for (var sym in row) {

				// append clipPath to svg
				// give clipPath an id
				// append rect to clipPath
				// give rect attrs based on lith data

				lithSvg.append('clipPath')
					.attr('id', 'clipped')
					.append('rect')
						.attr('x', xPosition)
						.attr('y', function(){
							if (d[0] % 100 == 0) {
								return yScale(d[0] - 100) + yOffset
							} else {
								return yScale((Math.ceil(d[0]/100) * 100) - 100) + yOffset
							}
						})
						.attr('width', (lithColDimension.width * (row[sym])/100))
						.attr('height', yScale(100))
						;

				// append svg:image to svg
				// set x & y to 0
				// set clip-path, attr to id of rect
				lithSvg.append('svg:image')
					.attr('xlink:href', `liths/${sym}.svg`)
					.attr('x', 0)
					.attr('y', function(){
							if (d[0] % 100 == 0) {
								// return yScale(d[0] - 100) + yOffset
							} else {
								// return yScale((Math.ceil(d[0]/100) * 100) - 100) + yOffset
							}
						})
					.attr('width', lithColDimension.width)
					.attr('height', yScale(100))
					.attr('class', `lith`)
					.attr('clip-path', 'url(#clipped)')

				xPosition += lithColDimension.width * (row[sym])/100
		}
		})
	})
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
			color += letters[ Math.floor(Math.random() * 16) ];
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
	// console.log("Column widths = 1: ", w === 1)
}










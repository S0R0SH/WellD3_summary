$(document).ready(function(){

	var margin = 10;
	var pageHeight = 800;
	var chartHeight = pageHeight - (margin * 2);
	var pageWidth = 600;
	var chartWidth = pageWidth - (margin * 2);
	var maxDepth = d3.max(depth_data, function(d) { return d[0]} );
	var data = depth_data_summary;
	var textSize = 12;

	// console.log("Max Depth: ", maxDepth);

	var columnDimension1 = { height: chartHeight, width: (chartWidth * 0.066667) };
	var columnDimension2 = { height: chartHeight, width: (chartWidth * 0.100000) };
	var columnDimension3 = { height: chartHeight, width: (chartWidth * 0.100000) };
	var columnDimension4 = { height: chartHeight, width: (chartWidth * 0.366667) };
	var columnDimension5 = { height: chartHeight, width: (chartWidth * 0.366667) };

	var columnDimensions = [columnDimension1, columnDimension2, columnDimension3, columnDimension4, columnDimension5];

	var ropScale = d3.scaleLinear()
		.range([0, columnDimension4.width])
		.domain([200, 0]);

	var wobScale = d3.scaleLinear()
		.range([0, columnDimension4.width])
		.domain([0, 100]);

	var mudScale = d3.scaleLinear()
		.range([0, columnDimension4.width/4])
		.domain([200, 600]);

	var yScale = d3.scaleLinear()
		.range([0, chartHeight])
		.domain([0, maxDepth]);

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

	var depthLabels  = createColumn(columnDimension1.height,columnDimension1.width, 0, 0);
	var lithColumn   = createColumn(columnDimension2.height,columnDimension2.width,columnDimension1.width, 0);
	var minColumn    = createColumn(columnDimension3.height,columnDimension3.width,columnDimension1.width + columnDimension2.width, 0);
	var tracksColumn = createColumn(columnDimension4.height,columnDimension4.width,columnDimension1.width + columnDimension2.width + columnDimension3.width, 0);
	var dataColumn   = createColumn(columnDimension5.height,columnDimension5.width,columnDimension1.width + columnDimension2.width + columnDimension3.width + columnDimension4.width, 0);

	var columns = [depthLabels, lithColumn, minColumn, tracksColumn, dataColumn];

	columns.forEach(function(d, i){
		createBorder(d, columnDimensions[i].width, chartHeight, 1.5)
	})

	// createBorder(svg, chartWidth, chartHeight, 1);

	var ropLine = d3.line()
		.x(function(d) { return ropScale(d[1]) })
		.y(function(d) { return yScale(d[0]) })
		.curve(d3.curveStepAfter);

	var mudLine = d3.line()
		.x(function(d) { return mudScale(d[7]) })
		.y(function(d) { return yScale(d[0]) })
		// .curve(d3.curveStepAfter);

	var wobLine = d3.line()
		.x(function(d) { return wobScale(d[2]) })
		.y(function(d) { return yScale(d[0]) })

		for (var i = 1; i < 4; i++ ){
				columns[i].append('g')
					.attr('class', 'y-axis')
					.call(createYGridlines(yScale, columnDimensions[i].width, chartHeight))
		}

	depthLabels.append('g')
		.attr('transform', "translate(17, 1)")
		.attr('class', 'depth-label')
		.call(createYGridlines(yScale, 0, chartHeight))

	d3.selectAll(".y-axis .tick line")
		.attr("opacity", function(d){ return (d%500 === 0)  ?  ".75" : ".25" })
		.attr("stroke-width", function(d){ return (d%500 === 0 ) ?  "1" : ".25" })

	d3.selectAll(".tick text")
		.attr("visibility", function(d){ return (d%500 === 0)  ?  "visible" : "hidden" })
		.attr("stroke-width", function(d){ return (d%500 === 0 ) ?  "1" : ".25" })

	drawTrack(tracksColumn, data, ropLine, "red", 1, 'none');
	drawTrack(tracksColumn, data, wobLine, "black", 1, 'none');

	// var line = d3.select('.main')
	// 	.append('line')
	// 	.attr('x1', 50)
	// 	.attr('y1', margin)
	// 	.attr('x2', 50)
	// 	.attr('y2', chartHeight + margin)
	// 	.attr('stroke', 'red')
	// 	.attr('stroke-width', 3);
	getLith();

		var charCapacity = 36;

		var txt = [
			[1000, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod']
		]

		var txt2 = [
			[1100, 'Lorem']
		]

		// splitText

		// console.log(txt)

		// writeText(txt2, dataColumn, yScale, textSize);

		var text = writeText(desMsg, dataColumn, yScale, textSize);
		// console.log(text);

		function splitText(text, length) {

		}

		var s = new XMLSerializer();
		console.log(s)

		// var d = svg;
		// console.log(d)
		// var str = s.serializeToString(d);
		// console.log(str);

		createSVGCode()
		// submit_download_form("pdf")

});

		function submit_download_form(output_format) {
			// Get the d3js SVG element
			var tmp = document.getElementById("svg-container");
			var svg = tmp.getElementsByTagName("svg")[0];
			// Extract the data as SVG text string
			var svg_xml = (new XMLSerializer).serializeToString(svg);

			// Submit the <FORM> to the server.
			// The result will be an attachment file to download.
			// var form = document.getElementById("svgform");
			form['output_format'].value = output_format;
			form['data'].value = svg_xml ;
			form.submit();
		}

function getLith() {
	var lithArr = [];
	lith.forEach(function(d){
		var lithObj = {};
		var d = d.split(' ')
		lithObj.depth = d[0];
		lithObj.lith = d[1];
		lithArr.push(lithObj);
	});
}

function createYGridlines(yScale, tickSize, height){
	return d3.axisRight(yScale)
		.tickSize(tickSize)
		.ticks(height/20);
}

function createXGridlines(scale, tickSize){
	return d3.axisRight(scale)
		.tickSize(tickSize)
}

var createColumn = function(height, width, x, y){
	return d3.select('#svg-group')
		.append('svg')
		.attr("class", "column")
		.attr("height", height)
		.attr('width', width)
		.attr('x', x)
		.attr('y', y)
}

var createDivColumn = function(height, width, x, y){
	return d3.select('body')
		.append('div')
		.attr("class", "column")
		.attr("height", height)
		.attr('width', width)
		.attr('position', 'absolute')
		.attr('left', x)
		.attr('top', y)
		.attr('background-color', 'powderblue')
}

var createBorder = function(selector, w, h, borderWidth) {
	selector.append('rect')
		.attr('width', w)
		.attr('height', h)
		.attr('class', 'border')
		.attr('fill', 'none')
		.attr("stroke-width", borderWidth)
		.attr("stroke", "#B3B7B7")
}

function writeText(data, col, scale, fontSize) {
	return col.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.text(function(d){ return d[1] })
			.attr('y', function(d){ return scale(d[0]) })
			.attr('x', 5)
			.attr('class', 'text des-msg')
			.style('font-size', fontSize)
			.style('fill', 'gray')
}

function drawTrack(column, data, track, color, lineWidth, fill){
		return column.append('path')
		.data([data])
		.attr('class', 'line')
		.attr('d', track)
		.attr("stroke-width", lineWidth)
		.attr("stroke", color)
		.attr("fill", fill);
}

function processText(text) {
	console.log(text)
}

function createSVGCode()
{
	// Get the d3js SVG element
	var tmp  = document.getElementById("svg-container");  //svg-container
	var svg = tmp.getElementsByTagName("svg")[0];  //first svg within svg-container

	// Extract the data as SVG text string
	var svg_xml = (new XMLSerializer).serializeToString(svg);

	console.log(svg_xml)

	//Optional: prettify the XML with proper indentations
	// svg_xml = vkbeautify.xml(svg_xml);

	// Set the content of the <pre> element with the XML
	// $("#svg_code").text(svg_xml);

	//Optional: Use Google-Code-Prettifier to add colors.
	// prettyPrint();
}










// var defaultColWidth = 80;
// var widths = {
// 	depthLabelCol: 30,
// 	ropCol:        200,
// 	col2:          200,
// 	lithCol:       20,
// 	minCol:        120,
// 	tempCol:       defaultColWidth,
// 	pitCol:        defaultColWidth,
// 	presCol:       defaultColWidth,
// 	desCol:        120
// }

// var padding = 10;
// var chartColor = "F0F2EF";

// var ropMaxScale = 100;
// var wobMaxScale = 80;
// var tempsMaxScale = 200;
// var pressMaxScale = 1200;
// var mudMaxScale = 1000;
// var numOfDivisions = 4;

// // var depth_data = seed_data;

// var maxDepth   = d3.max( depth_data, function(d) { return d[0] });
// var minDepth   = d3.min( depth_data, function(d) { return d[0] });
// var ropMax     = d3.max( depth_data, function(d) { return d[1] });
// var ropMin     = d3.min( depth_data, function(d) { return d[1] });
// var wobMax     = d3.max( depth_data, function(d) { return d[2] });
// var wobMin     = d3.min( depth_data, function(d) { return d[2] });
// var tempInMax  = d3.max( depth_data, function(d) { return d[3] });
// var tempInMin  = d3.min( depth_data, function(d) { return d[3] });
// var tempOutMax = d3.max( depth_data, function(d) { return d[4] });
// var tempOutMin = d3.min( depth_data, function(d) { return d[4] });

// var ropDivision   = (ropMaxScale   / numOfDivisions)
// var wobDivision   = (wobMaxScale   / numOfDivisions)
// var tempsDivision = (tempsMaxScale / numOfDivisions)
// var pressDivision = (pressMaxScale / numOfDivisions)
// var mudDivision   = (mudMaxScale   / numOfDivisions)

// var formatNumber = d3.format(",d");
// var height = (maxDepth - minDepth) * 2;
// var depthRange = [minDepth, maxDepth]

// // Setup Columns =============================================================

// var ropCol = createColumn("#rop-col", widths.ropCol);
// var depthLabelCol = createColumn("#depthlabel-col", widths.depthLabelCol);
// var lithCol = createColumn("#lith-col", widths.lithCol);
// var minCol = createColumn("#min-col", widths.minCol);
// var pitCol = createColumn("#mud-col", widths.pitCol);
// var tempCol = createColumn("#temp-col", widths.tempCol);
// var pressCol = createColumn("#press-col", widths.presCol);
// var desCol = createColumn("#des-col", widths.desCol);

// // Scales ====================================================================

// var ropXScale = createXScale(ropMaxScale, widths.ropCol)
// var mudXScale = createXScale(mudMaxScale, widths.pitCol)
// var tempsXScale = createXScale(tempsMaxScale, widths.tempCol)
// var pressXScale = createXScale(pressMaxScale, widths.presCol)

// var yScale = d3.scaleLinear()
// 	.domain(depthRange)
// 	.range([0, height])

// // Axes ======================================================================

// var ropXAxis = d3.axisTop(ropXScale)
// 		.tickValues([ropDivision, ropDivision * 2 , ropDivision * 3])
// 		.tickSize(height);

// var mudXAxis = d3.axisTop(mudXScale)
// 		.tickValues([mudDivision, mudDivision * 2 , mudDivision * 3])
// 		.tickSize(height);

// var tempsXAxis = d3.axisTop(tempsXScale)
// 		.tickValues([tempsDivision, tempsDivision * 2 , tempsDivision * 3])
// 		.tickSize(height);

// var pressXAxis = d3.axisTop(pressXScale)
// 		.tickValues([pressDivision, pressDivision * 2 , pressDivision * 3])
// 		.tickSize(height);

// var yAxis = createYAxis(widths.ropCol);

// var depthAxis = d3.axisRight(yScale)
// 	.tickSize(widths.ropCol)
// 	.tickFormat(function(d) { return formatNumber(d) })
// 	.ticks(height/20);

// ropCol.append("g")
// 		.attr("class", "x-axis")
// 		.attr("transform", "translate(0," + (height - 4) + ")")
// 		.append("g")
// 		.call(ropXAxis)
// 		.select(".domain").remove()
// 		.selectAll(".tick text")

// pitCol.append("g")
// 		.attr("class", "x-axis")
// 		.attr("transform", "translate(0," + (height - 4) + ")")
// 		.append("g")
// 		.call(mudXAxis)
// 		.select(".domain").remove()
// 		.selectAll(".tick text")

// tempCol.append("g")
// 		.attr("class", "x-axis")
// 		.attr("transform", "translate(0," + (height - 4) + ")")
// 		.append("g")
// 		.call(tempsXAxis)
// 		.select(".domain").remove()
// 		.selectAll(".tick text")

// pressCol.append("g")
// 		.attr("class", "x-axis")
// 		.attr("transform", "translate(0," + (height - 4) + ")")
// 		.append("g")
// 		.call(pressXAxis)
// 		.select(".domain").remove()
// 		.selectAll(".tick text")



// // ROP Track =====================================================

// var ropScale = d3.scaleLinear()
// 	.domain([0, ropMaxScale])
// 	.range([widths.ropCol, 0])

// var ropLine = d3.line()
// 	.x(function(d){ return ropScale(d[1]) })
// 	.y(function(d){ return yScale(d[0]) })
// 	.curve(d3.curveStepAfter)

// ropCol.append("path")
// 	.data([depth_data])
// 	.attr("class", "line")
// 	.attr("d", ropLine)
// 	.attr("stroke-width", .75)
// 	.attr("stroke", "red")

// // WOB Track =======================================================

// var wobScale = d3.scaleLinear()
// 	.domain([0, wobMaxScale])
// 	.range([0, widths.ropCol])

// var wobLine = d3.line()
// 	.x(function(d){ return wobScale(d[2]) })
// 	.y(function(d){ return yScale(d[0]) })

// ropCol.append("path")
// 	.data([depth_data])
// 	.attr("class", "line")
// 	.attr("d", wobLine)
// 	.attr("stroke-width", .75)
// 	.attr("stroke", "black")
// 	// .attr("stroke-dasharray", "2,1")

// // Temp Tracks =====================================================
// var tempScale = d3.scaleLinear()
// 	.domain([0, tempsMaxScale])
// 	.range([0, widths.tempCol])

// var tempInLine = d3.line()
// 	.x(function(d){ return tempScale(d[3]) })
// 	.y(function(d){ return yScale(d[0]) })

// var tempOutLine = d3.line()
// 	.x(function(d){ return tempScale(d[4]) })
// 	.y(function(d){ return yScale(d[0]) })

// tempCol.append("path")
// 	.data([depth_data])
// 	.attr("class", "line")
// 	.attr("d", tempInLine)
// 	.attr("stroke-width", 1.5)
// 	.attr("stroke", "blue")

// tempCol.append("path")
// 	.data([depth_data])
// 	.attr("class", "line")
// 	.attr("d", tempOutLine)
// 	.attr("stroke-width", 1.5)
// 	.attr("stroke", "red")

// // Mud Tracks =====================================================

// var pitScale = d3.scaleLinear()
// 	.domain([0, mudMaxScale])
// 	.range([0, widths.pitCol])

// var pitLine = d3.line()
// 	.x(function(d){ return pitScale(d[5]) })
// 	.y(function(d){ return yScale(d[0]) })

// pitCol.append("path")
// 	.data([depth_data])
// 	.attr("class", "line")
// 	.attr("d", pitLine)
// 	.attr("stroke-width", 1.5)
// 	.attr("stroke", "red")
// 	// .attr("stroke-dasharray", "2,1")

// // Pres Tracks =====================================================

// var presScale = d3.scaleLinear()
// 	.domain([0, pressMaxScale])
// 	.range([0, widths.presCol])

// var pressLine = d3.line()
// 	.x(function(d){ return presScale(+d[6]) })
// 	.y(function(d){ return yScale(d[0]) })

// pressCol.append("path")
// 	.data([depth_data])
// 	.attr("class", "line")
// 	.attr("d", pressLine)
// 	.attr("stroke-width", 1.5)
// 	.attr("stroke", "brown")
// 	// .attr("stroke-dasharray", "2,1")

// //===================================================================

// depthLabelCol.append("g")
// 	.attr("class", "depth-axis")
// 	.call(customDepthAxis)

// addYTicks(pitCol)
// addYTicks(ropCol)
// addYTicks(tempCol)
// addYTicks(pressCol)
// addYTicks(lithCol)
// addYTicks(minCol)

// pitCol.selectAll("p")
// 	.data(mudMsg)
// 	.enter()
// 	.append("text")
// 	.text(function(d) {
// 			if (d.length > 2) {
// 				return d[1] + "\n\n" + d[2]
// 			} else {
// 				return d[1]
// 			}
// 	 })
// 	.attr("y", function(d) {
// 			return yScale(d[0]) })
// 		.attr("x", 10)
// 		.attr("font-family", "Courier New")
// 		.attr("font-size", "12")
// 		.attr("stroke", "#13527d");

// d3.selectAll("g.y-axis g.tick line")
// 		// .attr("x2", function(d){ return d%100 === 0 ?  width : width/2})
// 		.attr("opacity", function(d){ return (d%100 === 0 || d%100 === 50)  ?  ".75" : ".25" })
// 		.attr("stroke-width", function(d){ return (d%100 === 0 || d%100 === 50) ?  "1.5" : ".5" })

// d3.selectAll("g.x-axis g.tick line")
// 	.attr("opacity", .75)
// 	.attr("stroke-width", .5)
// 	// .attr("stroke-dasharray", "2,1")


// function customYAxis(g) {
// 	g.call(yAxis);
// 	g.select(".domain").remove()
// 	g.selectAll(".y-axis .tick line")
// 	g.selectAll(".tick text")
// 	.attr("x", 20)
// 	.attr("dy", -2)
// 	.attr("opacity", function(d){ return (d%100 === 0 || d%100 === 50) ?  "1" : "0" })
// }

// function customXAxis(g) {
// 	g.call(ropXAxis);
// 	g.select(".domain").remove();
// 	g.selectAll(".tick text")
// }

// function customDepthAxis(g) {
// 	g.call(depthAxis);
// 	g.select(".domain").remove()
// 	g.selectAll(".depth-axis line").remove()
// 	g.selectAll(".tick text")
// 		.attr("x", 2)
// 		.attr("dy", 4)
// 		.attr("opacity", function(d){ return (d%100 === 0 || d%100 === 50) ?  "1" : "0" })
// 		.attr("text-anchor", "middle")
// 		.attr("transform", "translate(14, 0)")

// }

// function createColumn(id, width) {
// 	return d3.select(id)
// 		.attr("height", height)
// 		.attr("width", width)
// 		.style("background-color", chartColor)
// 		.append("g")
// }

// function createXScale(maxScale, range) {
// 	return d3.scaleLinear()
// 		.domain([0, maxScale])
// 		.range([0, range])
// }

// function createYAxis(colWidth) {
// 	return d3.axisRight(yScale)
// 		.tickSize(colWidth)
// 		.ticks(height/20)
// 		.tickFormat(function(d) { return formatNumber(d) })
// }

// function addYTicks(column){
// 	column.append("g")
// 	.attr("class", "y-axis")
// 	.call(yAxis)
// }





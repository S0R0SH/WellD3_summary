$(document).ready(function(){

	var margin = 10;
	var pageHeight = 800;
	var chartHeight = pageHeight - (margin * 2);
	var pageWidth = 600;
	var chartWidth = pageWidth - (margin * 2);
	var maxDepth = d3.max(depth_data, function(d) { return d[0]} );
	var data = depth_data_summary;
	var textSize = 12;

	var columnDimension1 = { height: chartHeight, width: (chartWidth * 0.066667) };
	var columnDimension2 = { height: chartHeight, width: (chartWidth * 0.100000) };
	var columnDimension3 = { height: chartHeight, width: (chartWidth * 0.100000) };
	var columnDimension4 = { height: chartHeight, width: (chartWidth * 0.366667) };
	var columnDimension5 = { height: chartHeight, width: (chartWidth * 0.366667) };

	var columnDimensions = [columnDimension1, columnDimension2, columnDimension3, columnDimension4, columnDimension5];

	var ropScale = createScale([0, columnDimension4.width], [200, 0])

	// call create scale function for these
	var wobScale = d3.scaleLinear()
		.range([0, columnDimension4.width])
		.domain([0, 200]);

	var mudScale = d3.scaleLinear()
		.range([0, columnDimension4.width/4])
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

	var ropTrack = d3.line()
		.x(function(d) { return ropScale(d[1]) })
		.y(function(d) { return yScale(d[0]) })
		.curve(d3.curveStepAfter);

	var mudTrack = d3.line()
		.x(function(d) { return mudScale(d[7]) })
		.y(function(d) { return yScale(d[0]) })
		// .curve(d3.curveStepAfter);

	var wobTrack = d3.line()
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

	drawTrack(tracksColumn, data, ropTrack, "red", 1);
	drawTrack(tracksColumn, data, wobTrack, "black", 1);


	var charCapacity = 36;

	var txt = [
		[1000, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod']
	]

	var txt2 = [
		[1100, 'Lorem']
	]

	// writeText(txt2, dataColumn, yScale, textSize);

	var text = writeText(desMsg, dataColumn, yScale, textSize);

	// console.log(lith[50])

	var tempLith = {depth: "630", lith: ['G', 'G', 'G', 'S', 'S']}

	function formatLith(lith){
		var symArr = [];
		lith.lith.forEach(function(d){
			if (!symArr.includes(d)){
				symArr.push(d)
			}
		});

		console.log(symArr)
	}

	formatLith(tempLith)
	console.log(lith)


});

function addLith(data, yScale, col, x) {
	return col.append('rect')
		.data(lith)
		.attr('width', 15)
		.attr('height', yScale(100))
		.attr('x', x)
		.attr('y', 50)
		.attr('stroke', 'purple')
		.attr('fill', 'green')
		.attr('stroke-width', 1);

}








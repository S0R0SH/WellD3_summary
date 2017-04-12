$(document).ready(function(){

	var margin = 10;
	var pageHeight = 800;
	var chartHeight = pageHeight - (margin * 2);
	var pageWidth = 600;
	var chartWidth = pageWidth - (margin * 2);
	var maxDepth = d3.max(depth_data, function(d) { return d[0]} );
	var data = depth_data_summary;
	var textSize = 12;

	var depthColDimension = { height: chartHeight, width: (chartWidth * 0.066667) };
	var lithColDimension  = { height: chartHeight, width: (chartWidth * 0.100000) };
	var minColDimension   = { height: chartHeight, width: (chartWidth * 0.100000) };
	var trakColDimension  = { height: chartHeight, width: (chartWidth * 0.500000) };
	var descColDimension  = { height: chartHeight, width: (chartWidth * 0.233333) };

	var columnDimensions = [
			depthColDimension,
			lithColDimension,
			minColDimension ,
			trakColDimension,
			descColDimension
	];

	// test: do column widths / total width = 1?
	columnWidthsEqual1(columnDimensions, chartWidth);

	var ropScale = createScale([0, trakColDimension.width], [200, 0])

	// call create scale function for these
	var wobScale = d3.scaleLinear()
		.range([0, trakColDimension.width])
		.domain([0, 200]);

	var xScale = d3.scaleLinear()
		.range([0, trakColDimension.width])
		.domain([0, 200]);

	var mudScale = d3.scaleLinear()
		.range([0, trakColDimension.width/4])
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

	var depthLabels  = createColumn(depthColDimension.height,depthColDimension.width, 0, 0);
	var lithColumn   = createColumn(lithColDimension.height,lithColDimension.width,depthColDimension.width, 0);
	var minColumn    = createColumn(minColDimension.height,minColDimension .width,depthColDimension.width + lithColDimension.width, 0);
	var dataColumn   = createColumn(trakColDimension.height,trakColDimension.width,depthColDimension.width + lithColDimension.width + minColDimension.width, 0);
	var tracksColumn = createColumn(descColDimension.height,descColDimension.width,depthColDimension.width + lithColDimension.width + minColDimension.width + trakColDimension.width, 0);

	var columns = [depthLabels, lithColumn, minColumn, tracksColumn, dataColumn];

	columns.forEach(function(d, i){
		createBorder(d, columnDimensions[i].width, chartHeight, 1.5)
	})

	createBorder(svg, chartWidth, chartHeight, 1);

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

	// Draw data tracks
	var ropPath = drawTrack(tracksColumn, data, ropTrack, "firebrick", 2);
	var wobPath = drawTrack(tracksColumn, data, wobTrack, "midnightblue", 2);

	var ropTotalLength = ropPath.node().getTotalLength();
	var wobTotalLength = wobPath.node().getTotalLength();

	// time it takes for tracks to animate
	var timeLength = 1000;

	animateLine(ropPath, ropTotalLength, timeLength, d3.easeLinear)
	animateLine(wobPath, wobTotalLength, timeLength, d3.easeLinear)

	var charCapacity = 36;

	var text = writeText(desMsg, dataColumn, yScale, textSize);

	const type = d3.annotationCallout

	const annotation = [{
		note: { label: "Longer text to show text wrapping"},
		x: wobScale(20),
		y: yScale(1500),
		dy: 50,
		dx: 50,
		connector: { "end": "arrow" }
	},
	{
		x: xScale(40), "y": yScale(2720.22046937348),
		dx: 50, "dy": 10,
		connector: { "end": "arrow" },
		subject: { "radius": 140.31076794375 },
		note: { "label": "Losing 20 bbls/hr" }
	}]

	const makeAnnotations = d3.annotation()
		.editMode(true)
		.type(type)
		.annotations(annotation)

		tracksColumn.append("g")
			.attr("class", "annotation")
			.call(makeAnnotations)

});

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

// tests ======================================

// test: do column widths = 1?
function columnWidthsEqual1(columns, chartWidth){
	var w = 0;
	columns.forEach(function(d){
		w += d.width/chartWidth
	})
	console.log("Column widths = 1: ", w === 1)
}










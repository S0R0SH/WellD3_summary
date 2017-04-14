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
	var descColDimension  = { height: chartHeight, width: (chartWidth * 0.500000) };
	var trackColDimension = { height: chartHeight, width: (chartWidth * 0.233333) };

	var columnDimensions = [
			depthColDimension,
			lithColDimension,
			minColDimension,
			descColDimension,
			trackColDimension
	];
	var spiral = "m 347.14285,528.07648 c 0.14325,5.08546 -6.78443,2.70209 -8.45238,0.23809 -4.52003,-6.67728 1.48621,-14.87387 7.97619,-17.14285 11.60907,-4.05869 23.14837,5.08737 25.83334,16.19048 3.94029,16.29425 -8.70157,31.56897 -24.40477,34.5238 -20.92989,3.93832 -40.04589,-12.3157 -43.21428,-32.61905 -3.9871,-25.54971 15.92864,-48.55073 40.83334,-51.90476 30.16292,-4.06218 57.0715,19.5407 60.59523,49.04763 4.15259,34.77289 -23.15216,65.60225 -57.26192,69.2857 -39.38106,4.2527 -74.13965,-26.76322 -77.97618,-65.4762 -4.3593,-43.98814 30.37403,-82.68172 73.69049,-86.66665 48.59453,-4.47049 91.22719,33.98463 95.35713,81.90477 4.58502,53.20044 -37.59511,99.7752 -90.11906,104.04761"
	// test: do column widths / total width = 1?
	columnWidthsEqual1(columnDimensions, chartWidth);

	var ropScale = createScale([0, trackColDimension.width], [200, 0])

	// call create scale function for these
	var wobScale = d3.scaleLinear()
		.range([0, trackColDimension.width])
		.domain([0, 200]);

	var xScale = d3.scaleLinear()
		.range([0, trackColDimension.width])
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

	// depthColDimension
	// lithColDimension
	// minColDimension
	// descColDimension
	// trackColDimension

	var columns = [depthColumn, lithColumn, minColumn, descColumn, tracksColumn];

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

	for (var i = 0; i < 4; i++ ){
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
	var ropPath = drawTrack(tracksColumn, data, ropTrack, "firebrick", 2);
	var wobPath = drawTrack(tracksColumn, data, wobTrack, "midnightblue", 2);

	var ropTotalLength = ropPath.node().getTotalLength();
	var wobTotalLength = wobPath.node().getTotalLength();

	// time it takes for tracks to animate
	var timeLength = 1000;

	animateLine(ropPath, ropTotalLength, timeLength, d3.easeLinear)
	animateLine(wobPath, wobTotalLength, timeLength, d3.easeLinear)

	var text = writeText(desMsg, descColumn, yScale, textSize);

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


	var tempLith = {depth: "630", lith: ['G', 'G', 'G', 'S', 'S']}

	function formatLith(lith){
		var symArr = [];
		lith.lith.forEach(function(d){
			if (!symArr.includes(d)){
				symArr.push(d)
			}
		});

	}

	// formatLith(tempLith)

	const makeAnnotations = d3.annotation()
		.editMode(true)
		.type(type)
		.annotations(annotation)

		tracksColumn.append("g")
			.attr("class", "annotation")
			.call(makeAnnotations)

	// addLith(selector, depth, w, h, color)
	for (var i = 0; i < 5000; i += 100) {
		addLith(lithColumn, yScale(i), lithColDimension.width, yScale(100), getRandomColor())
	}

	// var twist = fullPage.append("svg")
	// 		.attr('width', 600)
	// 		.attr('height', 800)
	// 		.attr('x', 0)
	// 		.attr('y', 0)
	// 		.append("path")
	// 			.attr('dx', 200)
	//       .attr("d", spiral)
	//       .attr("fill", "none")
	//       .attr("stroke-width", 20)
	//       .attr("stroke", getRandomColor())
	//       .attr('viewbox', 0, 0, 50, 50 )

   animateLine(twist, twist.node().getTotalLength(), 5000, d3.easeBounce)

});

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










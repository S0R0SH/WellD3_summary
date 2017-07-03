$(document).ready(function(){

	var margin = 10;
	var pageHeight = 1000;
	var headerHeight = 150;
	var chartHeight = pageHeight - headerHeight - (margin * 2);
	var pageWidth = 750;
	var chartWidth = pageWidth - (margin * 2);
	var pageTextSize = 10;

	// time it takes for tracks to animate
	var timeLength = 250;

	var depthDataUrl = 'http://localhost:3001/wells/well_data?well_num=1'

	var headerDimension   = { height: headerHeight, width: (chartWidth * 1.000) };
	var depthColDimension = { height: chartHeight,  width: (chartWidth * 0.020) };
	var lithColDimension  = { height: chartHeight,  width: (chartWidth * 0.095) };
	var minColDimension   = { height: chartHeight,  width: (chartWidth * 0.100) };
	var symColDimension   = { height: chartHeight,  width: (chartWidth * 0.020) };
	var trackColDimension = { height: chartHeight,  width: (chartWidth * 0.160) };

	var tempWidth = (depthColDimension.width + lithColDimension.width + minColDimension.width + symColDimension.width + trackColDimension.width) / chartWidth;

	var descColDimension  = { height: chartHeight,  width: (chartWidth * (1  - tempWidth)) };

	var columnDimensions = [ depthColDimension, lithColDimension, minColDimension, symColDimension, descColDimension, trackColDimension ];


	// test: do column widths / total width = 1?
	columnWidthsEqual1(columnDimensions, chartWidth);

	// var ropScale = createScale([0, trackColDimension.width], [100, 0])

	// Create scales
	var ropScale = d3.scaleLinear()
		.range([0, trackColDimension.width])
		.domain([0, 200]);

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
		.domain([0, 400]);

	// end create scales

	var svg = d3.select('#svg-container')
		.append('g')
			.append('svg')
			.attr('height', pageHeight)
			.attr('width', pageWidth)
			.attr('class', 'main-svg')
			.append('g')
				.attr('id', 'svg-group')
				.attr("transform", `translate(${10}, ${10})`);

	// function createColumn() args: height, width, x location, y location, class[optional]
	var headerSvg    = createColumn( headerDimension.height,   chartWidth, 0, 0, 'col header');
	var depthColumn  = createColumn( chartHeight, depthColDimension.width, 0, headerHeight, 'col depthCol' );
	var lithColumn   = createColumn( chartHeight,  lithColDimension.width, depthColDimension.width, headerHeight,'col lithCol' );
	var minColumn    = createColumn( chartHeight,   minColDimension.width, lithColDimension.width + depthColDimension.width, headerHeight, 'col minCol');
	var symColumn    = createColumn( chartHeight,   symColDimension.width, minColDimension.width  + lithColDimension.width + depthColDimension.width, headerHeight, 'col symCol');
	var descColumn   = createColumn( chartHeight,  descColDimension.width, symColDimension.width  + minColDimension.width  + lithColDimension.width + depthColDimension.width, headerHeight, 'col descCol');
	var tracksColumn = createColumn( chartHeight, trackColDimension.width, descColDimension.width + symColDimension.width  + minColDimension.width  + lithColDimension.width + depthColDimension.width, headerHeight, 'col trackCol');

	var fullPage = createColumn(chartHeight, pageWidth, 0, 0, 'chart');

	var columns = [depthColumn, lithColumn, minColumn, symColumn, descColumn, tracksColumn];

	// Create borders around all columns using column array.
	columns.forEach(function(d, i) {
		createBorder(d, columnDimensions[i].width, chartHeight)
	});

	// Create border for header.
	// function createBorder(), args: selector, width, height, stroke-width, border-color
	createBorder(headerSvg, chartWidth, headerHeight);

	// Create columns for min
	// function createMinColumn() args: columnToAppendTo, xLocation, width, height, class(optional)
	var qtz   = createMinColumn(minColumn, 0,                           minColDimension.width/9, chartHeight, 'min qtz'   )
	var cal   = createMinColumn(minColumn, minColDimension.width/9 * 1, minColDimension.width/9, chartHeight, 'min cal'   )
	var pyr   = createMinColumn(minColumn, minColDimension.width/9 * 2, minColDimension.width/9, chartHeight, 'min pyr'   )
	var epid  = createMinColumn(minColumn, minColDimension.width/9 * 3, minColDimension.width/9, chartHeight, 'min epid'  )
	var pyrh  = createMinColumn(minColumn, minColDimension.width/9 * 4, minColDimension.width/9, chartHeight, 'min pyrh'  )
	var chl   = createMinColumn(minColumn, minColDimension.width/9 * 5, minColDimension.width/9, chartHeight, 'min chl'   )
	var axin  = createMinColumn(minColumn, minColDimension.width/9 * 6, minColDimension.width/9, chartHeight, 'min axin'  )
	var actin = createMinColumn(minColumn, minColDimension.width/9 * 7, minColDimension.width/9, chartHeight, 'min actin' )
	var tourm = createMinColumn(minColumn, minColDimension.width/9 * 8, minColDimension.width/9, chartHeight, 'min tourm' )

	////////////////////////////////////////////////////////////////////

	// d3.json("tempData.json", function(err, d){
	// 	console.log(d);
	// });

	// d3.json(depthDataUrl, function (d) {
	d3.json("depthData.json", function (err, d) {
		var t = d3.transition().duration(1000);

		var wellData = d.data.attributes;
		var descriptions = wellData['summary-descriptions'];

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

		var ropLine = d3.line()
			.x(function(d) { return ropScale(d.rop) })
			.y(function(d) { return yScale(d.depth) })
			// .curve(d3.curveStepAfter)
			.curve(d3.curveStepAfter);

		var wobLine = d3.line()
			.x(function(d) { return wobScale(d.wob) })
			.y(function(d) { return yScale(d.depth) })

	var pOutLine = d3.line()
			.x(function(d) { return wobScale(d.pressure) })
			.y(function(d) { return yScale(d.depth) })





		var tempOutLine = d3.line()
			.x(function(d) { return tempOutScale(d.temp_out) })
			.y(function(d) { return yScale(d.depth) })

		var zeroLine = d3.line()
			.x(function() { return 0})
			.y(function(d) { return yScale(d.depth) });

		var maxLine = d3.line()
			.x(function() { return trackColDimension.width})
			.y(function(d) { return yScale(d.depth) });

		// Draw the horizontal gridlines.
		for ( var i = 0; i < columns.length; i++ ){
			if (i === 4 || i === 0) { continue }; //skip first and 5th column
			addHorizontalGridlines(columns[i], yScale, columnDimensions[i].width, chartHeight)
		}

		// Write depth labels
		console.log('Depth Column width =', depthColDimension.width)
		depthColumn.append('g')
			.attr('class', 'depth-label')
			.call(createYGridlines(yScale, 0, chartHeight))
		.selectAll("text")
			.attr("y", -depthColDimension.width/2 )
			.attr("x", 0)
			.attr("transform", "rotate(90)")
			.style("text-anchor", "middle");

		d3.selectAll(".y-axis .tick line")
			.attr("opacity",      function(d){ return (d % 500 === 0)  ?  "0.75" : ".25" })
			.attr("stroke-width", function(d){ return (d % 500 === 0 ) ?  "1.00" : ".25" })

		// Only show depth labels at 500 ft intervals and greater than 0.
		d3.selectAll(".tick text")
			.attr("visibility", function(d){ return (d % 500 === 0 && d > 0)  ?  "visible" : "hidden" })

		// Draw data tracks
		//drawTrack function, args: svgColumn, data, d3.line, color, stroke-width, initialLine, fill(opt)
		var ropPath			= drawTrack(tracksColumn, depthData, ropLine, "blue", 1, zeroLine);
		var tempOutPath = drawTrack(tracksColumn, depthData, tempOutLine, "red", 1, maxLine);

		// var ropLength = ropPath ? ropPath.node().getTotalLength() : 9999;
		// var tempOutLength = tempOutPath ? tempOutPath.node().getTotalLength() : 9999;

		// var easing = [
		// 	d3.easeElastic, d3.easeBounce, d3.easeLinear,
		// 	d3.easeSin, d3.easeQuad, d3.easeCubic, d3.easePoly,
		// 	d3.easeCircle, d3.easeExp, d3.easeBack
		// 	];

		// animateLine(ropPath, ropLength, timeLength, easing[4])
		// animateLine(tempOutPath, tempOutLength, timeLength, easing[4])
		var desMsg = [[60, "Spud CMHC-8 on 02/28/17.  Drill ahead f/69' with 26\"  bit and mud motor assembly."], [530, "Drill 26\" hole to 523'.  Run 16 jnts of 20\", 19.12#,  J-55, BUTT casing to a  depth of 522'. Drill ahead with 17.5\" bit w/Mud Motor and MWD."], [1195, "Water added to pits,cooling mud. Clean temp In probe to verify accurate measure."], [1510, "Mud Cooler On @ 1510'"], [1605, "Pull to shoe to wipe the hole do some rig repairs, run to  bottom, drill ahead."], [1963, "Building too much angle, POH  for new bit and tools."], [2070, "Drill to 2056', pull out of hole to check bit. Bit and  stabs bad: 1-2.5\" out of  gauge."], [2925, "Drill 17.5\" hole to 2934'. Pull tight coming out of hole @2730',work pipe free,wipe hole 2 times,Run 68 jnts of  13.375\",72#,L-80,BUTT casing  to a depth of 2925'."], [2978, "NOTE:Bit#5 was a RRB used for cleaning out cement and no new formation drilled."], [3059, "POH t/BHA, replace MWD tool"], [3240, "ROP dropping due to formation change,POH for tri-cone bit."], [3370, "Altered Zone @3370',only 10' Serp:lt grn-wht,com pink,med  gr-aphan,w/euhed and vng qtz."], [3680, "Tight hole f/3265-3676'."], [3970, "Pump 2 down at 3969'. Begin  losing 80 bbls/hr while  circulating. Pump 60 bbl lcm  pills at 3977' and 4003' to  cure losses."], [4420, "Begin losing 35bph@4421'.Lose 400bph initially at cnx when picking up high.Spot LCM pill and circulate losing ~125bph. Pull to shoe to condition mud."], [4480, "Drill ahead t/4480' w/80bph losses. Set 300' cement plug  @4488'.TOC @4203'.Drill ahead with 12.25\"bit and mud motor."], [4700, "Decr WOB @4680'while repair  pump#1.  120 SPM for pump#2."], [4770, "Shaker failed @4757'.Lose  60bbls over shakers."], [5095, "Begin losing 35bph @5071'. Loss rate increases to 300bph @5089'.Lose total circulation @5098' & during cnx @5106'. Set 200' cement plug#2 @5106'. Clean out cement and drill ahead t/5126' with 100bph  losses.Set 150' cement plug #3 @5126'."]]
		var text = writeText(desMsg, descColumn, yScale, pageTextSize);

		drawDescriptions(descriptions, descColumn, yScale, pageTextSize);

		descriptions.forEach(function(d){
			// console.log(d.depth)
			// console.log(d.content)
		});

		descColumn.selectAll('text')
			.data(descriptions)
			.enter()
			.append('text')
				.text(function(d){ console.log(d.content); return d.content })
				.attr('y', function(d){ return scale(d.depth) })
				.attr('x', 5)
				.attr('class', 'text des-msg')
				.style('font-size', 12)
				.style('fill', 'red')


		function drawDescriptions(data, col, scale, fontSize) {

		return col.selectAll('text')
				.data(data)
				.enter()
				.append('text')
				.text(function(d){ return d[content] })
				.attr('y', function(d){ return scale(d[depth]) })
				.attr('x', 5)
				.attr('class', 'text des-msg')
				.style('font-size', fontSize)
				.style('fill', 'black')
		}

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

		var newLith = toLithArray(d.data.attributes.lithologies);
		var lith100 = avgLithArray(newLith);


		drawLith(lithColumn, yScale, lithColDimension.width, lith100);

		$(window).on('resize', function(){
			drawLith(lithColumn, yScale, lithColDimension.width, lith100);
		});

		var min = d.data.attributes.mineralogies;

		min.forEach(function(d){
			drawMinLine(qtz,   'quartz',     d, yScale, 'blue')
			drawMinLine(cal,   'calcite',    d, yScale, 'black')
			drawMinLine(pyr,   'pyrite',     d, yScale, 'gold')
			drawMinLine(epid,  'epidote',    d, yScale, 'red')
			drawMinLine(pyrh,  'pyrhotite',  d, yScale, 'brown')
			drawMinLine(chl,   'chlorite',   d, yScale, 'green')
			drawMinLine(axin,  'axinite',    d, yScale, 'pink')
			drawMinLine(actin, 'actinolite', d, yScale, '#287458')
			drawMinLine(tourm, 'tourmaline', d, yScale, 'gray')
		});

		var symbolData = d.data.attributes["well-symbols"];

		// Add steam entry symbol to page
		symbolData.forEach(function(d){
			if(d.symbol === 'ntry') {
				addSymbol(ntry, d.depth)
			}
		})

		function addSymbol(shapeData, depth) {
			symColumn.append('path')
				.attr('d', shapeData)
				.attr('class', 'shape')
			  .attr('transform', `translate(${0}, ${yScale(depth)})scale(1.46)`)
				.style("fill",  'red')
				.style('opacity', .5);
		}

	});
});


function formatLithData() {
	var lithArr = [];

	var liths = d.data.attributes.lithologies;

	var lithData = lith.forEach(function(d){
		lithArr.push(formatLithData(d))
	})
}

function drawMinLine(svg, mineral, data, yScale, color) {
	return svg.append('line')
				.attr("x1", svg.attr("width")/2)
				.attr("y1", yScale(data.depth))
				.attr("x2", svg.attr("width")/2)
				.attr("y2", yScale(data.depth + 10.5))
				.attr('stroke-width', data[mineral] * 2)
				.attr('stroke', color);
}

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










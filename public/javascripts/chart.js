$(document).ready(function(){

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

	var headerDimension   = { height: headerHeight, width: (chartWidth * 1.000) };
	var depthColDimension = { height: chartHeight,  width: (chartWidth * 0.020) };
	var lithColDimension  = { height: chartHeight,  width: (chartWidth * 0.095) };
	var minColDimension   = { height: chartHeight,  width: (chartWidth * 0.100) };
	var trackColDimension = { height: chartHeight,  width: (chartWidth * 0.130) };

	var tempWidth = (depthColDimension.width + lithColDimension.width + minColDimension.width  + trackColDimension.width) / chartWidth;
	console.log('tempWidth', tempWidth)
	var descColDimension  = { height: chartHeight,  width: (chartWidth * (1  - tempWidth)) };

	console.log('min width', minColDimension.width/9)
	console.log("lith Width", lithColDimension.width)

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
		.append('g')
				.append('svg')
				.attr('height', pageHeight)
				.attr('width', pageWidth)
				.attr('class', 'main-svg')
				.append('g')
					.attr('id', 'svg-group')
					.attr("transform", `translate(${10}, ${10})`);

	var headerSvg  = createColumn(headerDimension.height, chartWidth, 0, 0);

	var depthColumn  = createColumn( depthColDimension.height, depthColDimension.width, 0, headerHeight);
	var lithColumn   = createColumn( lithColDimension.height, lithColDimension.width, depthColDimension.width, headerHeight, 'lith');
	var minColumn    = createColumn( minColDimension.height, minColDimension .width, lithColDimension.width + depthColDimension.width, headerHeight);
	var descColumn   = createColumn( descColDimension.height, descColDimension.width, minColDimension.width + lithColDimension.width + depthColDimension.width, headerHeight);
	var tracksColumn = createColumn( trackColDimension.height, trackColDimension.width, descColDimension.width + minColDimension.width + lithColDimension.width + depthColDimension.width, headerHeight);

	var fullPage = createColumn(chartHeight, pageWidth, 0, 0);

	var columns = [depthColumn, lithColumn, minColumn, descColumn, tracksColumn];

	columns.forEach(function(d, i){
		createBorder(d, columnDimensions[i].width, chartHeight, 1.5)
	})

	createBorder(headerSvg, chartWidth, headerHeight, 1.5);


	// var qtz = minColumn.append('svg')
	// 			.attr('x', 0)
	// 			.attr('y', 0)
	// 			.attr('width', minColDimension.width/9)
	// 			.attr('height', chartHeight)

	// createMinColumn(x, width, height, class)
	var qtz   = createMinColumn(minColumn, 0, minColDimension.width/9, chartHeight, 'qtz')
	var cal   = createMinColumn(minColumn, minColDimension.width/9, minColDimension.width/9, chartHeight, 'cal')
	var pyr   = createMinColumn(minColumn, minColDimension.width/9 * 2, minColDimension.width/9, chartHeight, 'pyr')
	var epid  = createMinColumn(minColumn, minColDimension.width/9 * 3, minColDimension.width/9, chartHeight, 'epid')
	var pyrh  = createMinColumn(minColumn, minColDimension.width/9 * 4, minColDimension.width/9, chartHeight, 'pyrh')
	var chl   = createMinColumn(minColumn, minColDimension.width/9 * 5, minColDimension.width/9, chartHeight, 'chl')
	var axin  = createMinColumn(minColumn, minColDimension.width/9 * 6, minColDimension.width/9, chartHeight, 'axin')
	var actin = createMinColumn(minColumn, minColDimension.width/9 * 7, minColDimension.width/9, chartHeight, 'actin')
	var tourm = createMinColumn(minColumn, minColDimension.width/9 * 8, minColDimension.width/9, chartHeight, 'tourm')


	console.log('**********')
	console.log(qtz)
	console.log(qtz.attr("width"));

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
		var ropPath = drawTrack(tracksColumn, depthData, ropTrack, "blue", 1);
		// var wobPath = drawTrack(tracksColumn, depthData, wobTrack, "black", 1);
		var tempOutPath = drawTrack(tracksColumn, depthData, tempOutTrack, "red", 1);

		var ropLength = ropPath ? ropPath.node().getTotalLength() : 9999;
		// var wobLength = wobPath ? wobPath.node().getTotalLength() : 9999;
		var tempOutLength = tempOutPath ? tempOutPath.node().getTotalLength() : 9999;


		// time it takes for tracks to animate
		var timeLength = 500;

		var easing = [
			d3.easeElastic, d3.easeBounce, d3.easeLinear,
			d3.easeSin, d3.easeQuad, d3.easeCubic, d3.easePoly,
			d3.easeCircle, d3.easeExp, d3.easeBack
			];

		animateLine(ropPath, ropLength, timeLength, easing[4])
		// animateLine(wobPath, wobLength, timeLength, easing[4])
		animateLine(tempOutPath, tempOutLength, timeLength, easing[4])
		var desMsg = [[60, "Spud CMHC-8 on 02/28/17.  Drill ahead f/69' with 26\"  bit and mud motor assembly."], [530, "Drill 26\" hole to 523'.  Run 16 jnts of 20\", 19.12#,  J-55, BUTT casing to a  depth of 522'. Drill ahead with 17.5\" bit w/Mud Motor and MWD."], [1195, "Water added to pits,cooling mud. Clean temp In probe to verify accurate measure."], [1510, "Mud Cooler On @ 1510'"], [1605, "Pull to shoe to wipe the hole do some rig repairs, run to  bottom, drill ahead."], [1963, "Building too much angle, POH  for new bit and tools."], [2070, "Drill to 2056', pull out of hole to check bit. Bit and  stabs bad: 1-2.5\" out of  gauge."], [2925, "Drill 17.5\" hole to 2934'. Pull tight coming out of hole @2730',work pipe free,wipe hole 2 times,Run 68 jnts of  13.375\",72#,L-80,BUTT casing  to a depth of 2925'."], [2978, "NOTE:Bit#5 was a RRB used for cleaning out cement and no new formation drilled."], [3059, "POH t/BHA, replace MWD tool"], [3240, "ROP dropping due to formation change,POH for tri-cone bit."], [3370, "Altered Zone @3370',only 10' Serp:lt grn-wht,com pink,med  gr-aphan,w/euhed and vng qtz."], [3680, "Tight hole f/3265-3676'."], [3970, "Pump 2 down at 3969'. Begin  losing 80 bbls/hr while  circulating. Pump 60 bbl lcm  pills at 3977' and 4003' to  cure losses."], [4420, "Begin losing 35bph@4421'.Lose 400bph initially at cnx when picking up high.Spot LCM pill and circulate losing ~125bph. Pull to shoe to condition mud."], [4480, "Drill ahead t/4480' w/80bph losses. Set 300' cement plug  @4488'.TOC @4203'.Drill ahead with 12.25\"bit and mud motor."], [4700, "Decr WOB @4680'while repair  pump#1.  120 SPM for pump#2."], [4770, "Shaker failed @4757'.Lose  60bbls over shakers."], [5095, "Begin losing 35bph @5071'. Loss rate increases to 300bph @5089'.Lose total circulation @5098' & during cnx @5106'. Set 200' cement plug#2 @5106'. Clean out cement and drill ahead t/5126' with 100bph  losses.Set 150' cement plug #3 @5126'."]]
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

		var newLith = toLithArray(d.data.attributes.lithologies);
		var lith100 = avgLithArray(newLith);

		drawLith(lithColumn, yScale, lithColDimension.width, lith100);

		$(window).on('resize', function(){
			drawLith(lithColumn, yScale, lithColDimension.width, lith100);
		})

		// Put in lith function
		function drawLith(lithColumn, yScale, columnWidth, lith){

			var lithSvg = lithColumn.append('svg')
				.attr('x', 0)
				.attr('height', yScale(maxDepth))
				.attr('width', columnWidth)

			var yOffset = .5;

			var td = d3.max(lith100, function(d) { return d[0]} );


			lith100.forEach(function(d){

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
							.attr('y', function(){
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
						.attr('xlink:href', function(){
							return `/images/lith/${syms[i]}.svg`
						})
						// .attr('fill', 'red')
						// .attr('stroke', 'black')
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
						.attr('class', `lith`)
						.attr('clip-path', 'url(#clipped)')

					xPosition += columnWidth * (percents[i])/100

				}
			})
		}
		// end of lith function

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
		})
	})
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
				.attr("y2", yScale(data.depth + 10))
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










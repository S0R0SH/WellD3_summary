var colDefaultWidth = 80;
var widths = {
	depthLabelCol: 30,
	ropCol:        200,
	col2:          200,
	lithCol:       20,
	minCol:        120,
	tempCol:       colDefaultWidth,
	mudCol:        colDefaultWidth,
	presCol:       colDefaultWidth,
	desCol:        120

}

var padding = 10;
var chartColor = "lightgrey";

var ropMaxScale = 100;
var wobMaxScale = 80;
var tempsMaxScale = 200;
var pressMaxScale = 200;
var mudMaxScale = 1000;
var numOfDivisions = 4;

var depth_data = seed_data;

var maxDepth = d3.max( depth_data, function(d) { return d[0] });
var minDepth = d3.min( depth_data, function(d) { return d[0] });
var ropMax =   d3.max( depth_data, function(d) { return d[1] });
var ropMin =   d3.min( depth_data, function(d) { return d[1] });
var wobMax =   d3.max( depth_data, function(d) { return d[2] });
var wobMin =   d3.min( depth_data, function(d) { return d[2] });

var ropDivision = (ropMaxScale/numOfDivisions)
var wobDivision = (wobMaxScale/numOfDivisions)
var tempsDivision = (tempsMaxScale/numOfDivisions)
var pressDivision = (pressMaxScale/numOfDivisions)
var mudDivision   = (mudMaxScale/numOfDivisions)

var formatNumber = d3.format(",d");
var height = (maxDepth - minDepth) * 2;
var depthRange = [minDepth, maxDepth]

// Setup Columns =============================================================

var ropCol = createColumn("#rop-col", widths.ropCol);
var depthLabelCol = createColumn("#depthlabel-col", widths.depthLabelCol);
var lithCol = createColumn("#lith-col", widths.lithCol);
var minCol = createColumn("#min-col", widths.minCol);
var mudCol = createColumn("#mud-col", widths.mudCol);
var tempCol = createColumn("#temp-col", widths.tempCol);
var pressCol = createColumn("#press-col", widths.presCol);
var desCol = createColumn("#des-col", widths.desCol);

// Scales ====================================================================

var ropXScale = createXScale(ropMaxScale, widths.ropCol)
var mudXScale = createXScale(mudMaxScale, widths.mudCol)
var tempsXScale = createXScale(tempsMaxScale, widths.mudCol)
var pressXScale = createXScale(pressMaxScale, widths.mudCol)

var yScale = d3.scaleLinear()
	.domain(depthRange)
	.range([0, height])

// Axes ======================================================================

var ropXAxis = d3.axisTop(ropXScale)
		.tickValues([ropDivision, ropDivision * 2 , ropDivision * 3])
		.tickSize(height);

var mudXAxis = d3.axisTop(mudXScale)
		.tickValues([mudDivision, mudDivision * 2 , mudDivision * 3])
		.tickSize(height);

var tempsXAxis = d3.axisTop(tempsXScale)
		.tickValues([tempsDivision, tempsDivision * 2 , tempsDivision * 3])
		.tickSize(height);

var pressXAxis = d3.axisTop(pressXScale)
		.tickValues([pressDivision, pressDivision * 2 , pressDivision * 3])
		.tickSize(height);

var yAxis = d3.axisRight(yScale)
	.tickSize(widths.ropCol)
	.ticks(height/20)
	.tickFormat(function(d) {
		return formatNumber(d);
	})

var depthAxis = d3.axisRight(yScale)
	.tickSize(widths.ropCol)
	.tickFormat(function(d) {
		return formatNumber(d);
	})
	.ticks(height/20);

ropCol.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + (height - 4) + ")")
		.append("g")
		.call(ropXAxis)
		.select(".domain").remove()
		.selectAll(".tick text")

mudCol.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + (height - 4) + ")")
		.append("g")
		.call(mudXAxis)
		.select(".domain").remove()
		.selectAll(".tick text")

tempCol.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + (height - 4) + ")")
		.append("g")
		.call(tempsXAxis)
		.select(".domain").remove()
		.selectAll(".tick text")

pressCol.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + (height - 4) + ")")
		.append("g")
		.call(pressXAxis)
		.select(".domain").remove()
		.selectAll(".tick text")



// ROP Stuff =====================================================
var ropScale = d3.scaleLinear()
	.domain([0, ropMaxScale])
	.range([widths.ropCol, 0])

var ropLine = d3.line()
	.x(function(d){ return ropScale(d[1]) })
	.y(function(d){ return yScale(d[0]) })
	.curve(d3.curveStepAfter)

// WOB Stuff =====================================================
var wobScale = d3.scaleLinear()
	.domain([0, wobMaxScale])
	.range([0, widths.ropCol])

var wobLine = d3.line()
	.x(function(d){ return wobScale(d[2]) })
	.y(function(d){ return yScale(d[0]) })

ropCol.append("path")
	.data([depth_data])
	.attr("class", "line")
	.attr("d", ropLine)
	.attr("stroke-width", .75)
	.attr("stroke", "red")

ropCol.append("path")
	.data([depth_data])
	.attr("class", "line")
	.attr("d", wobLine)
	.attr("stroke-width", .75)
	.attr("stroke", "black")

depthLabelCol.append("g")
	.attr("class", "depth-axis")
	.call(customDepthAxis)

ropCol.append("g")
	.attr("class", "y-axis")
	.call(yAxis)

mudCol.selectAll("p")
	.data(mudMsg)
	.enter()
	.append("text")
	.text(function(d) {
		// for (var j = 0; j < d.length; j++) {
			if (d.length > 2) {
				return d[1] + "\n\n" + d[2]
			} else {
				return d[1]
			}
	 })
	.attr("y", function(d) {
			return yScale(d[0]) })
		.attr("x", 10)
		.attr("font-family", "Courier New")
		.attr("font-size", "12")
		.attr("stroke", "#13527d");

d3.selectAll("g.y-axis g.tick line")
		// .attr("x2", function(d){ return d%100 === 0 ?  width : width/2})
		.attr("opacity", function(d){ return (d%100 === 0 || d%100 === 50)  ?  ".75" : ".25" })
		.attr("stroke-width", function(d){ return (d%100 === 0 || d%100 === 50) ?  "1.5" : ".5" })

d3.selectAll("g.x-axis g.tick line")
	.attr("opacity", .75)
	.attr("stroke-width", .5)
	// .attr("stroke-dasharray", "2,1")


function customYAxis(g) {
	g.call(yAxis);
	g.select(".domain").remove()
	g.selectAll(".y-axis .tick line")
	g.selectAll(".tick text")
	.attr("x", 20)
	.attr("dy", -2)
	.attr("opacity", function(d){ return (d%100 === 0 || d%100 === 50) ?  "1" : "0" })
}

function customXAxis(g) {
	g.call(ropXAxis);
	g.select(".domain").remove();
	g.selectAll(".tick text")
}

function customDepthAxis(g) {
	g.call(depthAxis);
	g.select(".domain").remove()
	g.selectAll(".depth-axis line").remove()
	g.selectAll(".tick text")
		.attr("x", 2)
		.attr("dy", 4)
		.attr("opacity", function(d){ return (d%100 === 0 || d%100 === 50) ?  "1" : "0" })
		.attr("text-anchor", "middle")
		.attr("transform", "translate(14, 0)")

}

// function addXAxisToColumn(column, axis){
// 	column.append("g")
// 		.attr("class", "x-axis")
// 		.attr("transform", "translate(0," + (height - 4) + ")")
// 		// .call(customXAxis)
// 		.call(axis)
// 		.append("g")

// }

function createXAxis(division) {
	xAxis = d3.axisTop(xScale)
		.tickValues([ropDivision, ropDivision* 2 , ropDivision * 3])
		.tickSize(height);
}

function createColumn(id, width) {
	return d3.select(id)
		.attr("height", height)
		.attr("width", width)
		.style("background-color", chartColor)
		.append("g")
}

function createXScale(maxScale, range) {
	return d3.scaleLinear()
		.domain([0, maxScale])
		.range([0, range])
}







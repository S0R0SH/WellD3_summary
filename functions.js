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

// function getLith() {
// 	var lithArr = [];
// 	lith.forEach(function(d){
// 		var lithObj = {};
// 		var d = d.split(' ')
// 		lithObj.depth = d[0];
// 		lithObj.lith = d[1].split(',');
// 		lithArr.push(lithObj);
// 	});
// 	return lithArr;
// }

function createYGridlines(yScale, tickSize, height){
	return d3.axisRight(yScale)
		.tickSize(tickSize)
		.ticks(height/20);
}

function createXGridlines(scale, tickSize){
	return d3.axisRight(scale)
		.tickSize(tickSize)
}

function createColumn(height, width, x, y){
	return d3.select('#svg-group')
		.append('svg')
		.attr("class", "column")
		.attr("height", height)
		.attr('width', width)
		.attr('x', x)
		.attr('y', y)
}

function createDivColumn(height, width, x, y){
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

function createBorder(selector, w, h, borderWidth) {
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
			.style('fill', 'black')
}

function drawTrack(column, data, track, color, lineWidth, fill='none'){
		return column.append('path')
		.data([data])
		.attr('class', 'line')
		.attr('d', track)
		.attr("stroke-width", lineWidth)
		.attr("stroke", color)
		.style("fill", fill);
}

function createSVGCode(){
	// Get the d3js SVG element
	var tmp  = document.getElementById("svg-container");  //svg-container
	var svg = tmp.getElementsByTagName("svg")[0];  //first svg within svg-container

	// Extract the data as SVG text string
	var svg_xml = (new XMLSerializer).serializeToString(svg);


	//Optional: prettify the XML with proper indentations
	svg_xml = vkbeautify.xml(svg_xml);

	console.log(svg_xml)
	// Set the content of the <pre> element with the XML
	// $("#svg_code").text(svg_xml);

	//Optional: Use Google-Code-Prettifier to add colors.
	// prettyPrint();
}

function verticalLine(x1, y1, x2, y2, color, width) {
		return d3.select('.main')
		.append('line')
		.attr('x1', x1)
		.attr('y1', y1)
		.attr('x2', x2)
		.attr('y2', y2)
		.attr('stroke', color)
		.attr('stroke-width', width);
}

function createScale(range, dom){
	return d3.scaleLinear()
	.range(range)
	.domain(dom);
}

//Text wrapping code adapted from Mike Bostock
var wrap = function wrap(text, width) {
  text.each(function () {
    var text = (0, _d3Selection.select)(this),
        words = text.text().split(/[ \t\r\n]+/).reverse(),

    // lineNumber = 0,
    lineHeight = .2,
        //ems
    // y = text.attr("y"),
    dy = parseFloat(text.attr("dy")) || 0;

    var word = void 0,
        line = [],
        tspan = text.text(null).append("tspan").attr("x", 0).attr("dy", dy + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("dy", lineHeight + dy + "em").text(word);
      }
    }
  });
};




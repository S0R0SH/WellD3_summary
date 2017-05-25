function parseLithFile(arr) {
	console.log("in parseLith")
	var lithData = [];
	d3.text("log/lith.txt").get(function(error, data){
		dataArr = data.split("\n")

		dataArr.forEach(function(d){
			// var dataObj = {};
			var arr = (d.split(' '))
			// dataObj['depth'] = arr[0];
			// dataObj['lith'] = arr[1];

			lithData.push(arr[0], arr[1]);
			// arr.push(dataObj)
		})
	});
	return lithData;
}

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

function createYGridlines(yScale, tickSize, height){
	return d3.axisRight(yScale)
		.tickSize(tickSize)
		.ticks(height/10);
}

function createXGridlines(scale, tickSize){
	return d3.axisRight(scale)
		.tickSize(tickSize)
}

function createColumn(height, width, x, y, cl='col'){
	return d3.select('#svg-group')
		.append('svg')
		.attr("class", "column")
		.attr("height", height)
		.attr('width', width)
		.attr('x', x)
		.attr('y', y)
		.attr('class', cl)
}
function createMinColumn(svgCol, x, width, height, cl=''){
	return svgCol.append('svg')
				.attr('x', x)
				.attr('y', 0)
				.attr('width', width)
				.attr('height', height)
				.attr('class', `min ${cl}`)
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

function createBorder(selector, w, h, borderWidth=.25, color="black") {
	selector.append('rect')
		.attr('width', w)
		.attr('height', h)
		.attr('class', 'border')
		.attr('fill', 'none')
		.attr("stroke-width", borderWidth)
		.attr("stroke", color)
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

	// console.log(svg_xml)
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

function getAvgLith(lithData) {
	// console.log(lithData)
	var numOfRecords = 1;

	var avgLithArr = [];
	var avgLith = {};
	var i = 0;

	lithData.forEach(function(d){
		var lithObj = d[1];
		var depth = d[0];


		for (sym in lithObj) {

			// if lithObj does not already have the symbol then create it
			if (!avgLith.hasOwnProperty((sym))){
				avgLith[sym] = lithObj[sym];
				// if the symbol exists then add percentage to it
			} else {
				// console.log(lithObj[sym])
				avgLith[sym] += lithObj[sym];
			}
		}

		if (depth % 100 === 0 || i === lithData.length - 1){
			// console.log(numOfRecords)
			for (percentage in avgLith) {
				avgLith[percentage] = (avgLith[percentage] / numOfRecords)
			}
			avgLithArr.push([depth, avgLith])
			// avgLithArr.push(avgLith)
			avgLith = {};
			numOfRecords = 0;
		}
		numOfRecords += 1;
		i += 1;
	});

	return avgLithArr;
}

function getAvgLithArray(lithData) {

	var lithArray = [];
	var avgLithArr = [];
	var avgLith = {};
	var syms = [];
	var percents = [];
	var i = 0;

	lithData.forEach(function(d){
		var syms = [];
		var percents = [];
		var lithObj = d[1];
		var depth = d[0];


		for (sym in lithObj) {
			syms.push(sym)
			percents.push(lithObj[sym])
		}

		lithArray.push([depth, syms, percents])

	});
}


function toLithArray(lithology) {

	var lithArray = [];
	lithology.forEach(function(d){
		var percents = [];

		for (sym in d) {
			percents = [
				d.felsite,
				d.blueschist,
				d.greenstone,
				d.chert,
				d.peridotite,
				d.mum,
				d.silicic_graywacke,
				d.lithic_graywacke,
				d.argillite,
				d.serpentine,
				d.clay,
				d.blank
			]
		}
			lithArray.push([d.depth, percents])
	});

	return lithArray
}

var testLith = [
	[ 10,  [ 20, 50, 50, 0 ] ],
	[ 20,  [ 50, 50, 10, 0 ] ],
	[ 30,  [ 40, 100, 40, 0 ] ],
	[ 40,  [ 50, 100, 40, 0 ] ],
	[ 50,  [ 10, 100, 50, 0 ] ],
	[ 60,  [ 70, 100, 0 , 10 ] ],
	[ 70,  [ 50, 100, 40, 0 ] ],
	[ 80,  [ 30, 100, 50, 0 ] ],
	[ 90,  [ 10, 100, 30, 0 ] ],
	[ 100, [ 10, 100, 60, 0 ] ],
]

// console.log(avgLithArray(testLith))

function avgLithArray(arr) {
	var percentTotal = [];
	var avg = [];
	var numOfRecords = 0;
	var depth = 0;
	var avgLithArr = [];
	var syms = ['F', 'X', 'G', 'C', 'T', 'D', 'I', 'L', 'A', 'S', 'Y', 'B'];

	arr.forEach(function(d){
		depth = d[0];
		var percents = d[1];

		// console.log(percents);
		var i = 0;
		// for (var i = 0; i < percents.)
		percents.forEach(function(d1){
			// console.log('d1', d1)
			if (percentTotal[i]) {
				percentTotal[i] += d1
			} else {
				percentTotal[i] = d1
			}
			i++;
		})

		if (depth % 100 === 0 || i === arr.length - 1) {
			percentTotal.forEach(function(d1){
				avg.push( d1 / ( numOfRecords ))
			})
			avgLithArr.push([depth, syms, avg])
			percentTotal = [];
			avg = [];
			numOfRecords = 0;
		}
			numOfRecords++;
	})

		return avgLithArr
}











$(document).ready(function(){

var svg = d3.select("#sandbox").append('svg');

svg.append('g')
	.append('rect')
		.attr('x', 200)
		.attr('y', 50)
		.attr('width', 200)
		.attr('height', 200)
		.attr('fill', 'green')
	.append('path')
		.attr('d', "M50,100 L131,66 L259,115 L339,50 L400,98 M350,150 L100,150")
		.attr('fill', 'none')
		.attr('stroke', 'blue')






})
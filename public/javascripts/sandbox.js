$(document).ready(function(){
		console.log("SandBox")
		var svg = d3.select('.sandbox').append('svg');

		svg.append('svg:image')
			.attr('xlink:href', '/images/lith/C.svg')
			.attr('x', 0)
			.attr('y', 200)
			.attr('width', 300)
			.attr('height', 100)

		svg.append('svg:image')
			.attr('xlink:href', '/images/lith/I.svg')
			.attr('x', 50)
			.attr('y', 300)
			.attr('width', 300)
			.attr('height', 100)

});



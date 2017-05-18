$(document).ready(function(){
	$("#printButton").click(function(e){
		e.preventDefault();
		console.log("Print page")

		var mode = 'iframe'; //popup
		// var mode = 'popup'; //popup
		var close = mode == "iframe";
		var options = { mode : mode, popClose : close};
		$("div.chart-area").printArea( options );
	});
});
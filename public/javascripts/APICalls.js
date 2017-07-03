$(document).ready(function(){
	console.log("API calls Ready")

	$('#get-data').on('click', function(event) {
		event.preventDefault();

		var request = $.ajax({
  		url: '/getdata',
  		method: 'GET'
  	});

  	request.done(function(response){
  		console.log('success');
  	});

  	request.fail(function(response){
  		console.log('AJAX request not completed.');
  	});

	});

})
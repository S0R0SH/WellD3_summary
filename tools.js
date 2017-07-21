module.exports = function(){
	var fs = require('fs')
	var fse = require('fs-extra')
	var jsonfile = require('jsonfile')

	var filename = './log/Depth.txt'
	var file = './tmp/data.json'
	var obj = {name: 'JP'}

	var depthData = [];

	fs.readFile(filename, 'utf8', function(err, data) {
		if (err) throw err;
		console.log('OK: ' + filename);

		// Convert string to array.
		data = data.split('\n')

		console.log("Data length =", data.length)
		console.log(data[data.length - 1] == "");

		// if the last line is blank, then remove it
		if (data[data.length - 1] == ""){
			data.splice(data.length - 1)
		};

		data.forEach(function(line, i){
			var lineArr = line.split('	');
			var depthObj = {};

			// Populate the object.
			depthObj.depth    = parseFloat(lineArr[0]);
			depthObj.rop      = parseFloat(lineArr[1]);
			depthObj.wob      = parseFloat(lineArr[2]);
			depthObj.tempIn   = parseFloat(lineArr[3]);
			depthObj.tempOut  = parseFloat(lineArr[4]);
			depthObj.pressure = parseFloat(lineArr[5]);

			// Push the object into an array.
			// jsonfile.writeFile(file, obj, function (err) { console.error(err) });
			depthData.push(depthObj);
		});

		// console.log(depthData)

		// fs.writeFile("./tmp/test.json", depthData, function(err) {
		// 	if(err) {
  //       return console.log(err);
  //   	}
  //   	console.log("The file was saved!");
		// });


		// var writeStream = fs.createWriteStream("./public/data/depthData.txt");

		// writeStream.write('[\n');
		// depthData.forEach(function(d, i){
		// 	writeStream.write(JSON.stringify(d));
		// 	// console.log(i);
		// 	// Ommit comma on last line
		// 	if (i !== depthData.length - 1){
		// 		writeStream.write(',');
		// 	}
		// 	writeStream.write('\n');
		// })

		// writeStream.write(']');
		// writeStream.end();




		// json file has four space indenting now

		// jsonfile.writeFile(file, '[\n', function (err) { console.error(err) });
		// jsonfile.writeFile(file, obj, function (err) { console.error(err) });
		// jsonfile.writeFile(file,  ']', function (err) { console.error(err) });

		console.log('length', depthData.length);

	});



}



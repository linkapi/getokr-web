var through2 = require('through2');

function ignoreSpecs(){

  return through2.obj(function (file, enc, callback) {
    var specPattern = /\.specs\./gi;
		if (!specPattern.test(file.history[0])) {
			this.push(file);
		}
		return callback();
	});
}

module.exports = ignoreSpecs;

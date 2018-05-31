const fs = require('fs');
const chalk = require('chalk');

module.exports = {
	writefile: function (filename, data, msg) {
		fs.writeFile(filename, data, 'utf-8', (err) => {
			if (err) {
				console.error(chalk.red.bold(err));	
			} else {
				if (msg)
					console.log(chalk.green.bold(msg));	
			}
		});
	}
};

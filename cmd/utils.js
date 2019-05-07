const fs = require('fs');
const chalk = require('chalk');

const { KEY_FILE, TODO_FILE, FIN_FILE } = require('./globals');

module.exports = {
	writeFile (filename, data, msg) {
		fs.writeFile(filename, data, 'utf-8', (err) => {
			if (err) {
				console.error(chalk.red.bold(err));	
			} else {
				if (msg)
					console.log(chalk.green.bold(msg));	
			}
		});
	},
	getKeyPairFromFile() {
		const keyText = fs.readFileSync(KEY_FILE, 'utf-8');
		return JSON.parse(keyText); 
	},
	getTodoItemsFromFile() {
		try {
			const todoText = fs.readFileSync(TODO_FILE, 'utf-8');
			return todoText; 
		} catch {
			return null;	
		}
	},
	getFinTodoItemsFromFile() {
		try {
			const finTodoText = fs.readFileSync(FIN_FILE, 'utf-8');
			return finTodoText; 
		} catch {
			return null;	
		}
	},
	notExistKeyFileExitProcess () {
		if (!fs.existsSync(KEY_FILE)) {
			console.log(chalk.red('Key file doesn\'t exist!'));
			console.log(chalk.yellow('You can get a key-pair using "td keygen"'));
			process.exit(1);
		}
	},
	showResult({ status, msg }) {
		if (status == 'success')
			console.log(chalk.yellow(msg));
		else
			console.log(chalk.red.bold(msg));
	}
};

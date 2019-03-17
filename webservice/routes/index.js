var express = require('express');
var router = express.Router();

const moment = require('moment');

const { User, Log, Tag } = require('../models')

/* GET home page. */
router.get('/', async (req, res, next) => {
	try {
		const users = await User.findAll();
		const logs = await Log.findAll({
			order: [
				['id', 'DESC'], // ASC
			],	
			include: [
				{ model: User, attributes: ['nickName'] },
				{ model: Tag, attributes: ['name'] },
			],
		});
		res.render('index', { users, logs, moment });
	} catch (error) {
		console.log(error);
		next(error);	
	}
});

module.exports = router;

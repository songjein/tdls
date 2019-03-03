var express = require('express');
var router = express.Router();

const { User } = require('../models')

/* GET home page. */
router.get('/', async (req, res, next) => {
	try {
		const users = await User.findAll();
		res.render('index', { users });
	} catch (error) {
		console.log(error);
		next(error);	
	}
});

module.exports = router;

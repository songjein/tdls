const express = require('express');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const router = express.Router();

const { User, Log } = require('../models')

const { SUCCESS, ERROR } = require('./status');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/', async (req, res, next) => {
	const { firstKey, secondKey, title, htmlBody } = req.body; 
	try {
		///////////////////////////////////////////////////////////////////////
		// [TODO] 이 부분 공통되는 부분이라 미들웨어로 빼기
		///////////////////////////////////////////////////////////////////////
		const user = await User.find({ where: { firstKey } });
		if (!user) {
			res.json({
				status: ERROR,
				msg: "not registered, you must finish 'td setinfo'",	
			});	
			return;
		}
		const valid = await bcrypt.compare(secondKey, user.secondKeyHash);
		if(!valid) {
			res.json({
				status: ERROR,
				msg: 'invalid key',
			});
			return;
		}
		///////////////////////////////////////////////////////////////////////
		const log = await Log.create({
			title, htmlBody, UserId: user.id,
		});

		console.log('@@', log);

		res.json({
			status: SUCCESS,
			msg: 'Log successfully created',
			log,
		});
	} catch (error) {
		console.error(error);	
		next(error);
	}
});

module.exports = router;

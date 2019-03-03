const express = require('express');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const router = express.Router();

const { User } = require('../models')

const { SUCCESS, ERROR } = require('./status');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/generateKey', (req, res, next) => {
	const keyGen = {
		firstKey: uuid(),
		secondKey: uuid(),
		msg: '로그인용 key입니다. 언제든 생성이 가능하지만, 키가 바뀔 경우 유저가 해당 키로 생성한 리소스에 대한 접근 및 수정이 불가능합니다.'
	};
  res.json(keyGen);
});

router.post('/getUserInfo', async (req, res, next) => {
	const { firstKey, secondKey } = req.body; 

	try {
		const user = await User.find({ where: { firstKey } });
		if (!user) {
			res.json({
				status: ERROR,
				msg: 'not a user',	
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
		const { nickName, company, memo, email, githubUrl } = user; 
		res.json({
			status: SUCCESS,
			msg: 'get user info',
			user: { nickName, company, memo, email, githubUrl } ,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}

});

router.post('/setUserInfo', async (req, res, next) => {
	let { firstKey, secondKey, nickName, company, memo, email, githubUrl } = req.body; 

	let user = await User.find({ where: { firstKey } });

	if (user) {
		user
			.update({ nickName, company, memo, email, githubUrl })
			.then((user) => {
				res.json({
					status: SUCCESS,
					msg: 'user info successfully updated',
					user: user,
				});
			});
		return;
	}
	const secondKeyHash = await bcrypt.hash(secondKey, 12);
	try {
		user = await User.create({
				firstKey, secondKeyHash, nickName, company, memo, email, githubUrl,
		});	
		res.json({
			status: SUCCESS,
			msg: 'user info successfully updated',
			user: user,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}

});

module.exports = router;

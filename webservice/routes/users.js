const express = require('express');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const moment = require('moment');

const router = express.Router();

const { User, Log, Tag } = require('../models')

const { SUCCESS, ERROR } = require('./status');

router.get('/', async (req, res, next) => {
	try {
		const users = await User.findAll();
		res.render('users', { users });
	} catch (error) {
		console.error(error);
	}
});


router.get('/telegram/todos/:nickName', async (req, res, next) => {
	const { nickName } = req.params;
	try {
		const user = await User.find({
			where: { nickName }	
		});
		res.json({ nickName, todoItems: user.todoItems });
	} catch (error) {
		console.log(error);
		next(error);
	}
});


router.get('/stats/:nickName', async (req, res, next) => {
	const { nickName } = req.params;
	try {
		const user = await User.find({ 
			where: { nickName },
			order: [
				[Log, 'id', 'DESC'],	
			],
			include: [{ model: Log, attributes: ['id', 'title', 'createdAt'] }], 
		});

		const dateToFormat = (d) => {
			return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
		}

		const dateToCnt = {};

		if (user.Logs) {
			for (let i = 0 ; i < user.Logs.length ; i ++) {
				const d = new Date(user.Logs[i].createdAt);
				const ds = dateToFormat(d);
				if (ds in dateToCnt) dateToCnt[ds] += 1;
				else dateToCnt[ds] = 1;
			}
		}
		
		if (user.finTodoItems) {
			const finTodoItems = JSON.parse(user.finTodoItems);

			for (let i = 0 ; i < finTodoItems.length ; i ++) {
				const d = new Date(finTodoItems[i].finishedAt);
				const ds = dateToFormat(d);
				if (ds in dateToCnt) dateToCnt[ds] += 1;
				else dateToCnt[ds] = 1;
			}
		}
		res.json(dateToCnt);

	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.get('/blog/:nickName', async (req, res, next) => {
	const { nickName } = req.params;
	try {
		const user = await User.find({ 
			where: { nickName },
			order: [
				[Log, 'id', 'DESC'],	
			],
			include: [
				{ model: Log, attributes: ['id', 'title', 'createdAt'], include: [Tag] }
			], 
		});
		res.render('user', { user, moment });
	} catch (error) {
		console.error(error);
	}
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
					user: { nickName, company, email, githubUrl, memo },
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


router.post('/setTodoItems', async (req, res, next) => {
	const { firstKey, secondKey, todoItems, finTodoItems } = req.body;
	try {
		///////////////////////////////////////////////////////////////////////
		// [TODO] 이 부분 공통되는 부분이라 함수로 빼기
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
				msg: 'invalid key-pair',
			});
			return;
		}
		///////////////////////////////////////////////////////////////////////

		await user.update({ todoItems, finTodoItems });
		res.json({
			status: SUCCESS,
			msg: 'todo-items successfully pushed :)',
		});
			
	} catch (error) {
		res.json({
			status: ERROR,
			msg: error,
		});		
	}
});

module.exports = router;

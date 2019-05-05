const express = require('express');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const moment = require('moment');

const router = express.Router();

const { User, Log, Tag } = require('../models')

const { SUCCESS, ERROR } = require('./status');


const authUserKey = async (firstKey, secondKey, msgs, flags) => {
	const user = await User.find({ where: { firstKey } });
	if (!user) {
		return {
			user,
			resObj: {
				status: flags.ERROR,
				msg: msgs.Error,	
			},
		}
	}
	const valid = await bcrypt.compare(secondKey, user.secondKeyHash);
	if(!valid) {
		return {
			user,
			resObj: {
				status: flags.ERROR,
				msg: 'invalid key-pair',
			},
		};
	}
	return {
		user, 
		resObj: { 
			status: flags.SUCCESS,	
			msg: msgs.SUCCESS,
		},
	};
};

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

router.post('/telegram/link', async (req, res, next) => {
	const { firstKey, secondKey, telegramId } = req.body;

	try {
		const { user, resObj } = await authUserKey(
			firstKey, secondKey,
			{ 
				SUCCESS: 'Now you can enjoy tdls in Telegram',
				ERROR: 'You should register tdls first! by "/td keyGen", "/td setUserInfo"',
			},
			{ SUCCESS, ERROR }
		);

		if (resObj.stats = ERROR) {
			res.json(resObj);	
			return;
		}
		await user.update({ telegramId });
		res.json(resObj);

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
		const { user, resObj } = await authUserKey(
			firstKey, secondKey,
			{ 
				SUCCESS: "todo-items successfully pushed :)", 
				ERROR: "not registered, you must finish 'td setinfo'" 
			},
			{ SUCCESS, ERROR }
		);
		if (resObj.status == ERROR) {
			res.json(resObj);
			return;	
		}
		await user.update({ todoItems, finTodoItems });
		res.json(resObj);
			
	} catch (error) {
		res.json({
			status: ERROR,
			msg: error,
		});		
	}
});

module.exports = router;

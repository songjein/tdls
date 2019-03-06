const express = require('express');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const router = express.Router();

const { User, Log } = require('../models')
const { SUCCESS, ERROR } = require('./status');

router.get('/', async (req, res, next) => {
	try {
		// ref. http://docs.sequelizejs.com/manual/tutorial/models-usage.html -> eager loading
		const logs = await Log.findAll({
			order: [
				['id', 'DESC'], // ASC
			],
			include: [{ model: User, attributes: ['nickName'] }], 
		});
		res.render('logs', { logs });
	} catch (error) {
		console.error(error);	
		next(error);
	}
});

router.get('/:logId', async (req, res, next) => {
	try {
		const log = await Log.find({ 
			where: { id: req.params.logId },
			include: [{ model: User, attributes: ['nickName'] }], 
		});
		res.render('log', { log });
	} catch (error) {
		console.error(error);	
		next(error);
	}
});

// https://stackoverflow.com/questions/37796227/body-is-empty-when-parsing-delete-request-with-express-and-body-parser
router.post('/delete', async (req, res, next) => {
	const { firstKey, secondKey, logId } = req.body; 
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
		// [TODO] 이 부분 살짝 공통되는 부분이긴 해.. 소유권 체크 부분
		///////////////////////////////////////////////////////////////////////
		let log = undefined;
		log = await Log.find({ 
			where: { id: logId },  
			include: [{ model: User, attributes: ['id'] }], 
		});
		if (log && (user.id !== log.User.id)) {
			res.json({
				status: ERROR,
				msg: 'You do not have ownership of this article #' + logId,
			});
			return;
		}
		if (log) {
			log = await log.destroy();
			res.json({
				status: SUCCESS,
				msg: 'Successfully deleted :)',
			});
			return;
		}
		///////////////////////////////////////////////////////////////////////
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.post('/', async (req, res, next) => {
	const { firstKey, secondKey, title, htmlBody, logId } = req.body; 
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
		let log = undefined;
		const updateMode = logId ? true : false;
		if (updateMode) {
			log = await Log.find({ 
				where: { id: logId },  
				include: [{ model: User, attributes: ['id'] }], 
			});
			if (log && (user.id !== log.User.id)) {
				res.json({
					status: ERROR,
					msg: 'You do not have ownership of this article ' + logId,
				});
				return;
			}
			if (log) {
				log = await log.update({ title, htmlBody });
				res.json({
					status: SUCCESS,
					msg: 'Successfully updated :) https://tdls.dev/logs/' + log.id,
				});
				return;
			}
			// else -> create new one
		}
		log = await Log.create({
			title, htmlBody, UserId: user.id,
		});
		res.json({
			status: SUCCESS,
			msg: 'Successfully created :) https://tdls.dev/logs/' + log.id,
			log,
		});
	} catch (error) {
		console.error(error);	
		next(error);
	}
});

module.exports = router;

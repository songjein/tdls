const express = require('express');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const moment = require('moment');

const router = express.Router();

const { User, Log, Tag, LogGraph } = require('../models')
const { SUCCESS, ERROR } = require('./status');

// [TODO] find -> findOne
// [TODO] sources, targets 도 include 기반으로 리팩터링?

router.get('/', async (req, res, next) => {
	try {
		// ref. http://docs.sequelizejs.com/manual/tutorial/models-usage.html -> eager loading
		const logs = await Log.findAll({
			order: [
				['id', 'DESC'], // ASC
			],
			include: [
				{ model: User, attributes: ['nickName'] },
				{ model: Tag, attributes: ['name'] },
			], 
		});
		res.render('logs', { logs, moment });
	} catch (error) {
		console.error(error);	
		next(error);
	}
});


router.get('/:logId', async (req, res, next) => {
	try {
		const log = await Log.find({ 
			where: { id: req.params.logId },
			include: [
				{ model: User, attributes: ['nickName'] },
				{ model: Tag, attributes: ['name'] },
			], 
		});
		const sources = await log.getSources();
		const targets = await log.getTargets();
		res.render('log', { log, sources, targets });
	} catch (error) {
		console.error(error);	
		next(error);
	}
});


router.get('/search/:tag', async (req, res, next) => {
	try {
		const tag = await Tag.find({
			where: { name: req.params.tag },
			include: [
				{ model: Log, include: [User] },	
			],
		});	
		res.render('search',{ tag, moment });
	}	catch (error) {
		console.error(error);	
		next(error);
	}
});

router.get('/telegram/search/:tag', async (req, res, next) => {
	try {
		const tag = await Tag.find({
			where: { name: req.params.tag },
			attributes: ['name', 'createdAt'],
			include: [
				{ model: Log },	
			],
		});	
		res.json(tag);
	}	catch (error) {
		console.error(error);	
		next(error);
	}
});




router.get('/raw/:logId', async (req, res, next) => {
	try {
		const log = await Log.find({ 
			where: { id: req.params.logId }
		});
		res.send(log.rawMarkdown);
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
				msg: 'You do not have ownership of this log #' + logId,
			});
			return;
		}
		if (log) {
			const sources = await log.getSources();
			const targets = await log.getTargets();
			const tags = await log.getTags();
			await log.removeSources(sources);
			await log.removeTargets(targets);
			await log.removeTags(tags);
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
	const { firstKey, secondKey, title, sourceList, tagList, htmlBody, rawMarkdown, logId } = req.body; 
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
					msg: 'You do not have ownership of this log ' + logId,
				});
				return;
			}
			if (log) {
				// [TODO] 참조 리스트를 업데이트 할 때 혹시 이전게 빠지면 어떻게 됨? 자동으로 삭제되나
				const tags = await Promise.all(
					tagList.map(tag => Tag.findOrCreate({ where: { name: tag } }))
				);
				log = await log.update({ title, htmlBody, rawMarkdown });

				const tagIdList = tags.map(tag => tag[0].id); // findOrCreate이 배열을 리턴하는 듯
				await log.setTags(tagIdList); // [TODO] set??
				
				// [TODO] 중복 연산 + array 체크?
				if (sourceList) {
					for (let i = 0 ; i < sourceList.length ; i ++) {
						const sourceLog = await Log.find({ where: { id: sourceList[i] } });
						if (sourceLog)
							await sourceLog.addTarget(log);
					}
				}

				res.json({
					status: SUCCESS,
					msg: 'Successfully updated :) https://tdls.dev/logs/' + log.id,
				});
				return;
			}
			// else -> create new one
		}
		
		const tags = await Promise.all(
			tagList.map(tag => Tag.findOrCreate({ where: { name: tag } }))
		);
		log = await Log.create({ 
			title, htmlBody, rawMarkdown, UserId: user.id,
		});
		tagIdList = tags.map(tag => tag[0].id); // findOrCreate이 배열을 리턴하는 듯
		await log.addTags(tagIdList);

		// [TODO] 중복 연산, 얘도 위처럼 프로미스 기반으로 바꾸면 깔끔한가
		if (sourceList) {
			for (let i = 0 ; i < sourceList.length ; i ++) {
				const sourceLog = await Log.find({ where: { id: sourceList[i] } });
				if (sourceLog)
					await sourceLog.addTarget(log);
			}
		}

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

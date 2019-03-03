const express = require('express');
const rand = require('generate-key');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/generateKey', (req, res, next) => {
	const keyGen = {
		key1: rand.generateKey(64),
		key2: rand.generateKey(64),
		msg: '로그인용 key입니다. 언제든 생성이 가능하지만, 키가 바뀔 경우 유저가 해당 키로 생성한 리소스에 대한 접근 및 수정이 불가능합니다.'
	};
  res.json(keyGen);
});


router.get('/setUserInfo', (req, res, next) => {
	res.json({});
});

module.exports = router;

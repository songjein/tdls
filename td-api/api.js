const utils = require('../cmd/utils');

const fs = require('fs');

var express = require('express');
var app = express();

const API_CHANNELS_FILE = __dirname + "/APICHANNELS.json"
const API_TODOS_FILE = __dirname + "/APITODOS.json"

// allow CORS request
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 *	in-memory channels & todos object
 *	keep the values for 1 week
 */

var channels = {
	/**
	 *	{"sa":"1234","sa2":"1234","zumlabs":"1234"}
	 */
};
if (fs.existsSync(API_CHANNELS_FILE))
	channels = JSON.parse(fs.readFileSync(API_CHANNELS_FILE, 'utf8'));

var todos = {
	/**
	 *	{
   *		"sa":[{"todo":"수요일 주간 회의록","timestamp":1528163153010},{"todo":"목요일 훈련소 입소","timestamp":1528180503249}],
   *		"sa2":[],"zumlabs":[{"todo":"프로젝트 마무리","timestamp":1528166496133},{"todo":"시스템 구조도","timestamp":1528173746149}]
	 *	}
	 */
};
if (fs.existsSync(API_TODOS_FILE))
	todos = JSON.parse(fs.readFileSync(API_TODOS_FILE, 'utf8'));


app.get('/', function(req, res) {
	res.json(channels);	
});

// TODO: 인증 추가? write/ read 구분
app.get('/getch/:id/:tmpidx', function(req, res) {
	let ret = {
		"status": "OK",
		"tmpidx": req.params.tmpidx // 임시로 for문과 callback에서의 idx 싱크를 위해 추가
	}

	const id = req.params.id;
	
	if (id in channels) {
		if (todos[req.params.id].length > 0) {
			ret["content"] = todos[req.params.id];	
		}
		else {
			ret["status"] = "EMPTY"; 
		}
	}
	else {
		ret["status"] = "NOCH"; 
	}
	res.json(ret);
});

app.get('/mkch', function(req, res) {
	let ret = {
		'status': 'OK',
	}
	const id = req.query.id;
	const pw = req.query.pw;
	if (id in channels) {
		ret['status'] = 'EXIST';	
		return res.json(ret);
	}
	// channel 및 todos 생성
	channels[id] = pw; // TODO: 암호화 하기
	todos[id] = [];

	res.json(ret);	

	utils.writefile(API_CHANNELS_FILE, JSON.stringify(channels), "CHANNELS Written Successfully");
	utils.writefile(API_TODOS_FILE, JSON.stringify(todos), "TODOS Written Successfully");
});

app.get('/pubch', function(req, res) {
	const id = req.query.id;
	const pw = req.query.pw;
	const td = req.query.td;

	// 비번 체크 생략

	//channels[id]["todos"].push({todo: td, timestamp: Date.now()});
	todos[id].push({todo: td, timestamp: Date.now()});

	res.send("Publish item to ch: " + id + " / "  + JSON.stringify(todos[id]));	

	utils.writefile(API_TODOS_FILE, JSON.stringify(todos), "TODOS Written Successfully");
});

app.get('/rmchtd', function(req, res) {
	const id = req.query.id;
	const pw = req.query.pw;
	const idx = req.query.idx;

	// 비번 체크 생략

	todos[id].splice(idx, 1)

	res.send("Remove item of ch" + id );	
});

app.listen(48484, function() {
	console.log("API app listening on port 48484");
});


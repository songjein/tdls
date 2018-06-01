var express = require('express');
var app = express();

// allow CORS request
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 *	in-memory channels object
 *	{	
 *		id_1: { "pw": password, "todos": [] }
 *		, id_2: {...}
 *		, ...	
 *	}	
 *	
 *	"todos" array's elements look like
 * 	{ "todo" : todo-item, "timestamp": timestamp for synchronization }
 * 
 *	keep the values for 1 week
 */
var channels = {
};
var todos = {
};

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
	const id = req.query.id;
	const pw = req.query.pw;
	//channels[id] = { "pw": pw, "todos": [] };
	channels[id] = pw; // TODO: 암호화 하기
	todos[id] = [];
	res.send("channel list : " + JSON.stringify(channels) );	
});

app.get('/pubch', function(req, res) {
	const id = req.query.id;
	const pw = req.query.pw;
	const td = req.query.td;

	// 비번 체크 생략

	//channels[id]["todos"].push({todo: td, timestamp: Date.now()});
	todos[id].push({todo: td, timestamp: Date.now()});

	res.send("Publish item to ch" + id + " / "  + JSON.stringify(todos[id]));	
});

app.listen(48484, function() {
	console.log("API app listening on port 48484");
});

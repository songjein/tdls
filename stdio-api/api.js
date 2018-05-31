var express = require('express');
var app = express();


/**
 *	in-memory channels object
 *	[
 *		{ "pw": password, "todos": [] }
 *		, {...}
 *		, ...	
 *	]
 *	
 *	"todos" array's elements look like
 * 	{ "todo" : todo-item, "timestamp": timestamp for synchronize }
 * 
 *	keep the values for 1 week
 */
var channels = {
};

app.get('/', function(req, res) {
	res.json(channels);	
});

app.get('/getch/:id/:tmpidx', function(req, res) {
	let ret = {
		"status": "OK",
		"tmpidx": req.params.tmpidx // 임시로 for문과 callback에서의 idx 싱크를 위해 추가
	}

	if (channels[req.params.id]) {
		ret["content"] = channels[req.params.id];	
	}
	else {
		ret["status"] = "EMPTY";
	}
	res.json(ret);
});

app.get('/mkch', function(req, res) {
	const id = req.query.id;
	const pw = req.query.pw;
	channels[id] = { "pw": pw, "todos": [] };
	res.send("channel list : " + JSON.stringify(channels) );	
});

app.get('/pubch', function(req, res) {
	const id = req.query.id;
	const pw = req.query.pw;
	const td = req.query.td;

	// 비번 체크 생략

	channels[id]["todos"].push({todo: td, timestamp: Date.now()});

	res.send("Publish item to ch" + JSON.stringify(channels[id]));	
});

app.listen(48484, function() {
	console.log("API app listening on port 48484");
});

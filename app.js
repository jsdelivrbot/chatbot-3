'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require("request");
var http = require('http');

var app = express();
var tokenizer = require("./modules/data_mask.js");
var session_id_generator = require("./modules/sessionid_generator.js");
var apiai = require("./modules/apiai_csp.js");
var csi_api = require("./modules/csi_api.js");

app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', function(req, res)
{
	var chat_id = req.body.chat_id;
	var query = req.body.query;
	var chtbt = req.body.csp;
	
	var tmp = query.split(" ");
	
	var agent_id = tmp[0];
	
	var session_id = session_id_generator.generate_key();
	
	console.log("Session Id:" + session_id + "\n");
	
	console.log("Message from Front End:" + query + "\n");
	
	tokenize(session_id, chat_id, query, res, chtbt, agent_id);

});

function tokenize(session_id, chat_id, query, res, chtbt, agent_id) 
{
	var msg = tokenizer.mask_data(chat_id, query);
	console.log("Tokenized String:" + msg + "\n");
  	send_api_ai_request(session_id, chat_id, msg, res, agent_id);
}

function send_api_ai_request(session_id, chat_id, message, res, agent_id)
{
	apiai.text_request(session_id, chat_id, agent_id, message, function(reply)
	{
		console.log("Reply from API AI:" + reply + "\n");
		detokenize(chat_id, reply, res);
	});
}

function detokenize(chat_id, tokenized_request, res) 
{
	var msg = tokenizer.unmask_data(chat_id, tokenized_request);
	console.log("Dekotenized String:" + msg + "\n");
	invoke_csi_api(chat_id, msg, res);
};


function invoke_csi_api(chat_id, msg, res)
{

	var m = msg.includes("(");

	if (m)
	{
		var methodList=msg.substring(msg.lastIndexOf("(")+1,msg.lastIndexOf(")"));
		var n = methodList.includes("|");
		
		var places = msg.match(/<(.*?)>/g);
		var urls = [];
		if (n)
		{
			var methods = methodList.split("|");
			for (var index in methods)
			{
				var ret = create_url(methods[index]);
				urls.push(ret);
			}
		}
		else
		{
			var ret = create_url(methodList);
			urls.push(ret);
		}
		invoke_urls(urls, places, msg, res);
	}
	else
	{
		res.send(msg);
	}
};

function invoke_urls(url_array, places, msg, res)
{
	var obj = url_array[0];
	var result = csi_api.get_agent_name(obj.value);
	msg = msg.replace(places[0], result);
	msg = msg.substring(0, msg.indexOf('?')+1);
	res.send(msg);
}

function create_url(message)
{
	var url = {};
	var method=message.substring(message.lastIndexOf("[")+1,message.lastIndexOf("]"));
	var nv = message.substring(message.lastIndexOf("BEGIN")+5,message.lastIndexOf("END"));

	var nvp = nv.split(":");
	var param = nvp[0];
	var value = nvp[1];
	
	url["method"] = method;
	url["param"] = param;
	url["value"] = value;
	
	return url;
}

var server = http.createServer(app).listen(app.get('port'), function()
{
	require('dns').lookup(require('os').hostname(), function (err, add, fam) 
	{
		  var host_url = "http://" + add + ":" + app.get('port');
		  console.log("The application URL is: " + host_url);
	})
	  
});

require('./modules/sockets.js').initialize(server);
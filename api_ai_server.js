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
app.set('port', process.env.PORT || 3000);

var baseURL = "http://localhost:8000/";
var tokenize_method = "tokenize";
var tokenize_parameter = "request";
var chatId = "chatID";
var detokenize_method = "detokenize";
var detokenize_parameter = "tokenized_request";
var request_method = "text_request";
var request_parameter = "msg";

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
	
	console.log("Chat Id:" + chat_id + "\n");
	
	console.log("Message from Front End:" + query + "\n");
	
	tokenize(chat_id, query, res, chtbt, agent_id);

});

function tokenize(chat_id, query, res, chtbt, agent_id) 
{
	  var url = baseURL + tokenize_method + "?" + tokenize_parameter + "=" + query + "&" + chatId + "=" + chat_id;
	  
	  request(url, function (error, response, body) 
	  {
		    if (!error && response.statusCode == 200) 
		    {
		    	var bd = body.substring(2);
		    	var str = bd.substring(0, bd.length - 2);
		    	var s = str.replace(/\s+/g, ' ');
		    	console.log("Tokenized String:" + s + "\n");
		    	send_api_ai_request(chat_id, s, res, agent_id);
		    }
		    else
		    {
		    	console.log("ERROR in Tokenization");
		    	console.log(url);
		    }
	  })
}

function send_api_ai_request(chat_id, message, res, agent_id)
{
	var url = baseURL + request_method + "?" + request_parameter + "=" + message + "&agent_id=" + agent_id + "&chat_id=" + chat_id;
	  
	  request(url, function (error, response, body) 
	  {
		    if (!error && response.statusCode == 200) 
		    {
		    	var bd = body.substring(2);
		    	var str = bd.substring(0, bd.length - 2);
		    	var result = str.replace(/\s+/g, ' ');
		    	
		    	console.log("Response from API.ai:" + result + "\n");

		    	detokenize(chat_id, result, res);
		    }
		    else
		    {
		    	console.log("ERROR in API.ai Request");
		    	console.log(url);
		    }
	  })
}

function detokenize(chat_id, tokenized_request, res) 
{
	  var url = baseURL + detokenize_method + "?" + detokenize_parameter + "=" + tokenized_request + "&" + chatId + "=" + chat_id;
	  
	  request(url, function (error, response, body) 
	  {
		    if (!error && response.statusCode == 200) 
		    {
		    	var bd = body.substring(2);
		    	var str = bd.substring(0, bd.length - 2);
		    	console.log("Dekotenized String:" + str + "\n");
		    	invoke_csi_api(chat_id, str, res);
		    }
		    else
		    {
		    	console.log("ERROR in Detokenization");
		    	console.log(url);
		    }
		})
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
	switch (url_array.length) 
	{
	    case 1:
	    	getRequest(url_array[0]).then(function (body1) 
	    	{
	    		var result = body1.slice(2, -2);
	    		msg = msg.replace(places[0], result);
	    		msg = msg.substring(0, msg.indexOf('?')+1);
	    		res.send(msg);
	    	});
	        break;
	    case 2:
	    	getRequest(url_array[0]).then(function (body1) 
	    	{
	    		var result = body1.slice(2, -2);
	    		msg = msg.replace(places[0], result);
	    	    return getRequest(url_array[1]);
	    	}).then(function (body2) 
	    	{
	    		var result = body2.slice(2, -2);
	    		msg = msg.replace(places[1], result);
	    		msg = msg.substring(0, msg.indexOf('?')+1);
	    		res.send(msg);
	    	});
	        break;
	    case 3:
	    	getRequest(url_array[0]).then(function (body1) 
	    	{
	    		var result = body1.slice(2, -2);
	    		msg = msg.replace(places[0], result);
	    	    return getRequest(url_array[1]);
	    	}).then(function (body2) 
	    	{
	    		var result = body2.slice(2, -2);
	    		msg = msg.replace(places[1], result);
	    	    return getRequest(url_array[2]);
	    	}).then(function (body3) 
	    	{
	    		var result = body3.slice(2, -2);
	    		msg = msg.replace(places[2], result);
	    		msg = msg.substring(0, msg.indexOf('?')+1);
	    		res.send(msg);
	    	});
	        break;
	} 

}

function create_url(message)
{
	var method=message.substring(message.lastIndexOf("[")+1,message.lastIndexOf("]"));
	var nv = message.substring(message.lastIndexOf("BEGIN")+5,message.lastIndexOf("END"));

	var nvp = nv.split(":");
	var param = nvp[0];
	var value = nvp[1];
	
	var url = baseURL + method + "?" + param + "=" + value;
	
	return url;
}

function getRequest(url) 
{
    return new Promise(function (success, failure) 
    {
        request(url, function (error, response, body) 
        {
            if (!error && response.statusCode == 200) 
            {
                success(body);
            }
            else 
            {
                failure(error);
            }
        });
    });
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
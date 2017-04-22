'use strict';

var apiai = require("apiai");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require("request");

var app = express();

var baseURL = "http://localhost:8000/";
var tokenize_method = "tokenize";
var tokenize_parameter = "request";
var chatId = "chatID";
var detokenize_method = "detokenize";
var detokenize_parameter = "tokenized_request";

var client_access_token = "7b9b86d65618439f9dffd7b4a8b81399";

var app_apiai = apiai(client_access_token);

var apiai_options = 
{
    sessionId: '123456'
};


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', function(req, res)
{
	var chat_id = req.body.chat_id;
	var query = req.body.query;
	
	tokenize(chat_id, query, res);

});

function tokenize(chat_id, query, res) 
{
	  var url = baseURL + tokenize_method + "?" + tokenize_parameter + "=" + query + "&" + chatId + "=" + chat_id;
	  
	  request(url, function (error, response, body) 
	  {
		    if (!error && response.statusCode == 200) 
		    {
		        send_request(chat_id, body, res);
		    }
		    else
		    {
		    	console.log("ERROR in Tokenization");
		    }
	  })
}

function send_request(chat_id, message, res)
{
	var request = app_apiai.textRequest(message, apiai_options);

	request.on('response', function(response) 
	{
	    var result = response.result.fulfillment.speech;
	    detokenize(chat_id, result, res);
	});

	request.on('error', function(error) 
	{
	    console.log(error);
	});

	request.end();
}

function detokenize(chat_id, tokenized_request, res) 
{
	  var url = baseURL + detokenize_method + "?" + detokenize_parameter + "=" + tokenized_request + "&" + chatId + "=" + chat_id;
	  console.log(url);
	  
	  request(url, function (error, response, body) 
	  {
		    if (!error && response.statusCode == 200) 
		    {
		        res.send(body);
		    }
		})
};

app.listen(3000, function (err) 
{
	  if (err) 
	  {
	    throw err
	  }
	 
	  console.log('Server started on port 3000')
});
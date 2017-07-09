var util = require('util');
var apiai = require("apiai");
var apiai_client_access_token = "9df44c38a2844f46a8ec1c6f1f64e1df";
var apiai_app = apiai(apiai_client_access_token);
var context_list = {};

var text_request = function(chat_id, msg, callback) 
{
	var options = create_options(chat_id);
	
	console.log("Request Options: " + JSON.stringify(options));
	
	var request = apiai_app.textRequest(msg, options);

	request.on('response', function(response) 
	{
		process_response(chat_id, response, callback);
	});

	request.on('error', function(error) 
	{
		give_response(error, callback);
	});

	request.end();
};

var event_request = function(chat_id, event_name, callback) 
{
	var options = create_options(chat_id);
	console.log("Event Options: " + JSON.stringify(options));
	var event = 
	{
	    name: event_name
	};

	var request = apiai_app.eventRequest(event, options);

	request.on('response', function(response)
	{
		process_response(chat_id, response, callback);
	});

	request.on('error', function(error) 
	{
		give_response(error, callback);
	});

	request.end();
};

var create_options = function(chat_id)
{
	var options = 
	{
		    sessionId: chat_id
	};
	
	var contexts = get_context(chat_id);
	
	if (contexts)
	{
		options["contexts"] = contexts;
	}
	
	return options;
}

var add_context = function(chat_id, contexts)
{
	if (chat_id in context_list)
	{
		delete context_list[chat_id]; 
	}
	context_list[chat_id] = contexts;
}

var get_context = function(chat_id)
{
	if (chat_id in context_list)
	{
		return context_list[chat_id]
	}
	else
	{
		return "";
	}
}

var process_response = function(chat_id, response, callback)
{
	//console.log(util.inspect(response, false, null));
	
	var contexts = response.result.contexts;
	add_context(chat_id, contexts);
	var intentName = response.result.metadata.intentName;
	var strValue = response.result.fulfillment.speech;
	
	if (strValue) 
	{
		var res_obj = {"msg": strValue, "intent": intentName};
	    give_response(JSON.stringify(res_obj), callback);
	}
	else
	{
		var res_obj = {"msg": "I could not process your request. Would you please provide the information again", "intent": "None"};
		give_response(JSON.stringify(res_obj), callback);
	}
}


var give_response = function(msg, callback)
{
	if( typeof callback == 'function' )
	{
        callback(msg);
    }
}

module.exports = 
{
  text_request,
  event_request
};
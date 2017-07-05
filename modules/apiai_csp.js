var apiai = require("apiai");
var apiai_client_access_token = "9df44c38a2844f46a8ec1c6f1f64e1df";
var apiai_app = apiai(apiai_client_access_token);

var text_request = function(chat_id, agent_id, msg, callback) 
{
	
	var options = 
	{
		    sessionId: chat_id
	};

	var request = apiai_app.textRequest(msg, options);

	request.on('response', function(response) 
	{
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
	});

	request.on('error', function(error) 
	{
		give_response(error, callback);
	});

	request.end();
};

var give_response = function(msg, callback)
{
	if( typeof callback == 'function' )
	{
        callback(msg);
    }
}

module.exports = 
{
  text_request
};
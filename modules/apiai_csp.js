var apiai = require('apiai');
var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/conversation.log', category: 'conversation' }
  ]
});

var apiai_client_access_token = "9df44c38a2844f46a8ec1c6f1f64e1df";
var apiai_app = apiai(apiai_client_access_token);
var logger = log4js.getLogger('conversation'); 

var text_request = function(session_id, chat_id, agent_id, msg, callback) 
{
	var options = 
	{
		    sessionId: session_id
	};

	var request = apiai_app.textRequest(msg, options);

	request.on('response', function(response) 
	{
		var intentName = response.result.metadata.intentName;
		var strValue = response.result.fulfillment.speech;
		var log_msg = chat_id + ", " + agent_id + ", " + msg + ", " + strValue + ", " + intentName;
		if (strValue) 
		{
			logger.info(log_msg);
		    give_response(strValue, callback);
		}
		else
		{
			give_response("I could not process your request. Would you please provide the information again", callback);
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
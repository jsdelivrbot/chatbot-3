var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: 'smart_chat_conversation',
    streams: [{
        type: 'rotating-file',
        path: 'logs/conversation.log',
        period: '1d',   // daily rotation
        count: 3        // keep 3 back copies
    }]
});

var log_message = function(msg) 
{
	log.info(msg);
};

module.exports = 
{
	log_message
};

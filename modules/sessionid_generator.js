var crypto = require('crypto');

var generate_key = function() 
{
	var token = crypto.randomBytes(16).toString('hex');
	return token;
};

module.exports = 
{
	generate_key
};
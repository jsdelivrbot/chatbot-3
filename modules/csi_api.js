var get_agent_name = function(agent_id) 
{
	var text = "Donovon";
	
	switch(agent_id)
	{
	    case "rg123q":
	        text = "Rob";
	        break;
	    case "vs098t":
	        text = "Vincent";
	        break;
	    case "dd567p":
	        text = "Doug";
	        break;
	    default:
	        text = "David";
	}
	
	return text;
};

module.exports = 
{
	get_agent_name
};
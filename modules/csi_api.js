var agent_ids = new Array("ma123q", "jd123j", "vc123r", "dp123a", "ab123c", "ue123d", "dd123e", "vs123f", "rk123g", "rb123h", "um123i", "ua123k");

var get_agent_name = function(agent_id) 
{
	var text = "Donovon";
	
	switch(agent_id)
	{
	    case "ma123q":
	        text = "Mike";
	        break;
	    case "jd123j":
	        text = "John";
	        break;
	    case "vc123r":
	        text = "Vincent";
	        break;
	    case "dp123a":
	        text = "David";
	        break; 
	    case "ab123c":
	        text = "Amelia";
	        break;
	    case "ue123d":
	        text = "Ulysses";
	        break;
	    case "dd123e":
	        text = "Doug";
	        break;
	    case "vs123f":
	        text = "Veronica";
	        break;
	    case "rk123g":
	        text = "Robert";
	        break;
	    case "rb123h":
	        text = "Ron";
	        break;
	    case "jf123i" :
	        text = "Umberto";
	        break;
	    case "tc123k":
	        text = "Uluka";
	        break;
	    default:
	        text = "Max";
	}
	
	return text;
};

var validate_account_status = function(str)
{
	var x = str.slice(-1);
	switch(Number(x))
	{
	 	case 2:
	 		return "sns_event_acct_bad";
	    case 3:
	    	return "sns_event_aots_outage";
	    case 4:
	    	return "sns_event_aots_fine";
	    default:
	    	return "sns_event_acct_good";
	}
};

var validate_serial_number = function(str)
{
	var x = str.endsWith("9");
    if(x)
    {
    	return "sns_event_sn_invalid";
    }
    else
    {
        return "sns_event_sn_valid";
    }
};

var check_aots_outage = function(str)
{
	var x = str.endsWith("6");
    if(x)
    {
    	return "sns_event_aots_outage";
    }
    else
    {
        return "sns_event_aots_fine";
    }
};

module.exports = 
{
	get_agent_name,
	validate_account_status,
	validate_serial_number,
	check_aots_outage
};
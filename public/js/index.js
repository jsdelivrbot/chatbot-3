var socket = io.connect('/');
socket.on('message', function(txt)
{
	 var message = JSON.parse(txt);
	 switch(message.type)
	 {
	 	case "progressMessage":
	 		setStatus(message.val);
			$('.status').addClass('success');
	 	break;
	 }
	 
});


// var MAX_CHAR = 200;
var recognition;
var agent_id;
var chtbt;
var agent_img;
var uuid = guid();
var agent_imgs = new Array("img/dave_small.png", "img/ray_small.png", "img/scott_small.png", "img/todd_small.png");
var agent_ids = new Array("ma123q", "jd123j", "vc123r", "dp123a", "ab123c", "ue123d", "dd123e", "vs123f", "rk123g", "rb123h", "um123i", "ua123k");
var tec_field_services_products = new Array("All Products OOS", "DTV", "IPTV", "VOIP", "Internet");
var tec_field_services_transport_types = new Array("FTTP/FTTC", "IP-CO", "IP-RT", "FTTN/FTTN-BP",  "FTTP/FTTC - Greater than 100 MG");
var tec_arc_products = new Array("ABF", "IP ARC");
var other_transport_types = new Array("N/A");
var all_product_oos_exceptions = new Array("Sync No Service", "No Sync", "Order Error", "Pair Change Tool Failure", "Port Change Tool Failure", "Network Outage", "Assignment Verification Tool Failure", "Assignment Corrections", "RTID Corrections", "No Light/Low Light", "ONT Activation Fallout", "Repair Ticket Creation", "Fiber Port Change Tool Failure (FMO)");
var dtv_exceptions = new Array("OLI Errors", "Wired to Wireless Conversion", "Remove DTV From Order", "Package Change", "IV Waiver", "Service Call Support");
var internet_exceptions = new Array("Slow Browse",
		"Unable to Browse",
		"Webistes Unreachable",
		"Registration Issues",
		"Static IP Assistance",
		"Speed - Upgrade/Downgrade",
		"Profile - Upgrade/Downgrade",
		"Member ID Issues");
var iptv_exceptions = new Array("No Picture",
		"Package Upgrade/Downgrade",
		"Equipment Swap Failure",
		"VOD Assistance",
		"Equipment Troubleshooting"
);
var voip_exceptions = new Array("IAD Issues",
		"Porting Issues",
		"No Dial Tone",
		"Cannot Receive/Make Calls",
		"Unable to Call Specific TN's",
		"Voicemail Assistance",
		"MyATT Zone Issues"
);
var ip_arc_exceptions = new Array("Sync No Service",
		"AOTS",
		"Static IP Assistance",
		"VoIP Assistance",
		"172 IP Assistance",
		"ONT Activations",
		"IPTV App Issues",
		"Website Unreachable",
		"No Light/Low Light"
);
var abf_exceptions = new Array("Sync no Service",
		"IAD Assistance",
		"NTI Change",
		"Order Assistance",
		"Static IP Assistance",
		"Other",
		"RG/STB Support",
		"Emux / EMT issues"
);

$(function()
{
	$("#chat").fadeOut();
	setInterval(doDate, 1000);
	toggleOptions();
	/*
	 $('textarea').keypress(function(e) {
		    var tval = $('textarea').val(),
		        tlength = tval.length,
		        set = MAX_CHAR,
		        remain = parseInt(set - tlength);
		    $('.msg-limit').text("Characters remained: " + remain);
		    if (remain <= 0 && e.which !== 0 && e.charCode !== 0) {
		        $('textarea').val((tval).substring(0, tlength - 1))
		    }
		})
	*/
	$("#usermsg").keypress(function(event) 
	{
		if (event.which == 13) 
		{
			send_chat_msg(event);
		}
	});
	
	$("#submitmsg").click(function(event) 
	{
		send_chat_msg(event);
	});
			
	$("#done").click(function(event) 
	{
		event.preventDefault();
		$("#prechat").fadeIn();
		$("#chat").fadeOut();
		$('.chatbox').empty();
		$('#usermsg').val('');
		setStatus("");
		//$('.msg-limit').text("Message Limit: " + MAX_CHAR + " characters");
	});
	
	$("#chat_btn").click(function(event) 
	{
		var sep = " ";
		var acd = $( "#wgtc option:selected" ).text();
		agent_id = $( "#tan option:selected" ).text();
		var ban = $( "#ban" ).val();
		var customer_name = $( "#custname" ).val();
		var product = $( "#pdt option:selected" ).text();
		var transport_type = $( "#ttyp option:selected" ).text();
		var cbr = $( "#tcbr" ).val();
		var excp = $( "#excp option:selected" ).text();
		chtbt = $( "#chtbt option:selected" ).val();
		uuid = guid();
		agent_img = agent_imgs[Math.floor(Math.random()*agent_imgs.length)];
		var text = agent_id.trim() + sep + ban.trim() + sep + cbr + sep + product + sep + transport_type + sep + "sync_no_service";
		
		var tmp = customer_name.split(" ");
		
		switch(tmp.length)
		{
			case 1:
		        text = text + sep + tmp[0];
		        break;
		    case 2:
		    	text = text + sep + tmp[0] + sep + tmp[1];
		        break;
		    case 3:
		    	text = text + sep + tmp[0] + sep + tmp[1] + sep + tmp[2];
		        break;
		    default:
		        text = text + sep + customer_name;
		}
		
		if(validate_ban())
		{
			if (validate_cbr())
			{
				if (validate_customer_name())
				{
					$("#prechat").fadeOut();
					$("#chat").fadeIn();
					send_msg(event, text);
				}
			}
		}
	});
	
	$("#ban").focus(function () 
	{
		setStatus("Please enter a 9 digit BAN");
		$('.status').addClass('error');
	});
	
	$("#tcbr").focus(function () 
	{
		setStatus("Please enter a 10 digit CBR");
		$('.status').addClass('error');
	});
	
	$("#custname").focus(function () 
	{
		setStatus("Please enter at least four character name");
		$('.status').addClass('error');
	});
	
	$('#ban').blur(function()
	{
	    validate_ban()
	});
	$('#tcbr').blur(function()
	{
	    validate_cbr()
	});
	$('#custname').blur(function()
	{
	    validate_customer_name()
	});
});

function validate_ban()
{
	var ban = $( "#ban" ).val();
	if(ban.length == 9 && $.isNumeric( ban) )
	{
		$('.status').removeClass('error');
		setStatus("");
		return true;
	}
	else
	{
		setStatus("Please enter a 9 digit BAN");
		$('.status').addClass('error');
		return false;
	}
}

function validate_cbr()
{
	var cbr = $( "#tcbr" ).val();
	if(cbr.length == 10 && $.isNumeric( cbr))
	{
		$('.status').removeClass('error');
		setStatus("");
		return true;
	}
	else
	{
		setStatus("Please enter a 10 digit CBR");
		$('.status').addClass('error');
		return false;
	}
}

function validate_customer_name()
{
	var customer_name = $( "#custname" ).val();
	if (customer_name.length > 3 && isAlphabetic(customer_name))
    {
		$('.status').removeClass('error');
		setStatus("");
		return true;
    }
	else
	{
		setStatus("Please enter at least four characters name");
		$('.status').addClass('error');
    	 return false;
	}
}

function createOptionString(k, a)
{
	var text = "";
	for (i = 0; i < a.length; i++) 
	{
		var key = k + i;
		text += "<option value='" + key + "'>" + a[i] + "</option>";
	} 
	
	return text;
}

function updateListSelection(listId, txt)
{
	$(listId).empty().html(txt);
	$(listId + " > option").each(function(index, element) 
	{
		if (index == 0)
		{
			$(listId + ' option').eq(index).prop('selected', true);
		}
		else
		{
			$(listId + ' option').eq(index).prop('disabled', true);
		}
	});
}

function toggleOptions()
{
	append_agent_ids();
	var wgtcName = $('#wgtc').find(":selected").val();
	toggleProductDropDown(wgtcName);
	$("#wgtc").change(function () 
	{
        var val = $(this).val();
        toggleProductDropDown(val);
        var product = $('#pdt').find(":selected").val();
        toggleTransportTypeDropDown(product, val);
        var product_text = $('#pdt').find(":selected").text();
        toggleExceptionDropDown(product_text);
    });
	
	var product = $('#pdt').find(":selected").val();
	var product_text = $('#pdt').find(":selected").text();
    toggleTransportTypeDropDown(product, wgtcName);
    toggleExceptionDropDown(product_text);
    $("#pdt").change(function () 
    {
        var val = $(this).val();
        var product_text = $('#pdt').find(":selected").text();
        var wgtcName = $('#wgtc').find(":selected").val();
        toggleTransportTypeDropDown(val, wgtcName);
        toggleExceptionDropDown(product_text);
    });
}

var append_agent_ids = function()
{
	var txt = createOptionString("tan", agent_ids);
	$("#tan").empty().html(txt);
	$('#tan option[value=tan0]').attr('selected','selected');
}

function toggleProductDropDown(val)
{
	var txt = "";
	switch (String(val)) 
    {
        case "wgtc1":
        	txt = createOptionString("pdt", tec_field_services_products);
            break;
        case "wgtc2":
        	txt = createOptionString("pdt", tec_arc_products);
            break;
        case "wgtc3":
        	txt = createOptionString("pdt", tec_arc_products);
            break;
        case "wgtc4":
        	txt = createOptionString("pdt", tec_arc_products);
            break;
        case "wgtc5":
        	txt = createOptionString("pdt", tec_arc_products);
        default:
          console.log("Didn't match");
          break;
    }
	updateListSelection("#pdt", txt);
}

function toggleTransportTypeDropDown(product, workgroup)
{
	var txt = "";
	if (String(workgroup) == "wgtc1")
	{
		switch (String(product)) 
	    {
	        case "pdt0":
	        	txt = createOptionString("ttype", tec_field_services_transport_types);
	            break;
	        case "pdt1":
	        	txt = createOptionString("ttype", other_transport_types);
	            break;
	        case "pdt2":
	        	txt = createOptionString("ttype", other_transport_types);
	            break;
	        case "pdt3":
	        	txt = createOptionString("ttype", other_transport_types);
	            break;
	        case "pdt4":
	        	txt = createOptionString("ttype", other_transport_types);
	        default:
	          console.log("Didn't match");
	          break;
	    }
	}
	else
	{
		txt = createOptionString("ttype", other_transport_types);
	}
	
	updateListSelection("#ttype", txt);
}

function toggleExceptionDropDown(product)
{
    switch (String(product)) 
    {
        case "All Products OOS":
        	txt = createOptionString("excp", all_product_oos_exceptions);
            break;
        case "DTV":
        	txt = createOptionString("excp", dtv_exceptions);
            break;
        case "Internet":
        	txt = createOptionString("excp", internet_exceptions);
            break;
        case "IPTV":
        	txt = createOptionString("excp", iptv_exceptions);
            break;
        case "VOIP":
        	txt = createOptionString("excp", voip_exceptions);
            break;
        case "IP ARC":
        	txt = createOptionString("excp", ip_arc_exceptions);
            break;
        case "ABF":
        	txt = createOptionString("excp", abf_exceptions);
             break;
        default:
          console.log("Didn't match");
          break;
    }
    updateListSelection("#excp", txt);
}

function clearFields()
{
	$('#ban').val('');
	$('#tcbr').val('');
	$('#custname').val('');
}

function send_chat_msg(event)
{
	var text = $("#usermsg").val();
	var result = validateUserMessage(text);
	var my_msg =  agent_id + " ( " + formatDate(new Date()) + " ) " + text;
	var styled_my_msg = "<div class='msgMe'>" + my_msg + "</div>";
	//setResponse(styled_my_msg);
	setMessageResponse(my_msg, true, agent_img)
	$('#usermsg').val('');
	setStatus("");
	//$('.msg-limit').text("Message Limit: " + MAX_CHAR + " characters");
	
	if (!result.trim())
	{
		send_msg(event, text);
	}
	else
	{
		event.preventDefault();
		var bot_msg = "bot123 ( " + formatDate(new Date()) + " ) " + result;
		var styled_bot_msg = "<div class='msgBot'>" + bot_msg + "</div>";
		//setResponse(styled_bot_msg);
		setMessageResponse(bot_msg, false, "img/bot.png")
		$('#usermsg').val('');
		setStatus("");
	}
	
}

function doDate()
{
    var str = "";

    var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

    var now = new Date();

    str += days[now.getDay()] + ", " + now.getDate() + " " + months[now.getMonth()] + " " + now.getFullYear() + " " + now.getHours() +":" + now.getMinutes() + ":" + now.getSeconds();
    document.getElementById("todaysDate").innerHTML = str;
}

function validateUserMessage(text)
{
	if (!text.trim()) 
	{
	    return "We currently do not accept blank chat messages";
	}
	else
	{
		if (hasNumber(text))
		{
			var ban = text.match(/\d+/);
			var tsize = ban.toString().length;

			switch (tsize) 
			{
			    case 9:
			    	return "";
			    case 14:
			    	return "";
			    default:
			        return "I typically look for 9 digits in a BAN or 14 digits in a serial number. I see this is not either. Can you please try one more time ?";
			}
		}
		else
		{
			return "";
		}
	}
}

function isAlphabetic(str)
{
	return /^[A-Za-z\s]+$/.test(str);
}

function hasNumber(myString)
{
	  return /\d/.test(myString);
}

function isNumeric(n) 
{
	  return !isNaN(parseFloat(n)) && isFinite(n);
}

function hasBan(myString) 
{
	return /#####[0-9]{4}|[0-9]{9}/.test(myString);
}

function hasSN(value) 
{
	return /^[a-z0-9]+$/i.test(value);
}

function formatDate(date) 
{
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  var ampm = hours >= 12 ? 'pm' : 'am';
	  hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  var strTime = hours + ':' + minutes + ' ' + ampm;
	  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

function send_msg(event, text)
{
	$('#usermsg').prop('readonly', true);
    $('#usermsg').addClass('input-disabled');
	event.preventDefault();
	send(text);
}

function send(text) 
{
	$.post("/chat",{query: text, chat_id: uuid, "agent_id": agent_id, csp: chtbt}, function(data)
	{
		 var bot_msg = "bot123 ( " + formatDate(new Date()) + " ) " + data;
		 var styled_bot_msg = "<div class='msgBot'>" + bot_msg + "</div>";
		// setResponse(styled_bot_msg);
		 
		 setMessageResponse(bot_msg, false, "img/bot.png")
    });
}

function setResponse(val) 
{
	$('#chatbox').append($('<li>').html( val ));
	var objDiv = document.getElementById("chatbox");
	objDiv.scrollTop = objDiv.scrollHeight;
}

function setMessageResponse(val, isRequest, img) 
{
	setStatus("");
	$('#usermsg').prop('readonly', false);
    $('#usermsg').removeClass('input-disabled');
	//var myTruncatedString = val.substring(0,MAX_CHAR);
    var myTruncatedString = val;
	if (isRequest)
	{
		var tech_msg = '<span class="chatmsg response">' + myTruncatedString + '</span><img src="' + img + '" alt="ATT Logo"/>';
		$('#chatbox').append($('<li>').html(tech_msg));
	}
	else
	{
		var bot_msg = '<span><img src="' + img + '" alt="ATT Logo"/></span><span class="chatmsg">' + myTruncatedString + '</span>';
		$('#chatbox').append($('<li>').html(bot_msg));
	}
	
	var objDiv = document.getElementById("chatbox");
	objDiv.scrollTop = objDiv.scrollHeight;
}

function setStatus(val) 
{
	$('.status').html(val);
}

function guid() 
{
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
}
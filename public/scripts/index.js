var accessToken = "0eb2a34046304c8583f10ae15abf98b3";
var baseUrl = "https://api.api.ai/v1/";
var recognition;

$(function()
{
	$("#input").keypress(function(event) 
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
			
	$("#chat").fadeOut();
	$("#done").click(function(event) 
	{
		event.preventDefault();
		$("#prechat").fadeIn();
		$("#chat").fadeOut();
	});
	$("#chat_btn").click(function(event) 
	{
		var workgroup= $( "#wgtc option:selected" ).text();
		var agent = $( "#tan" ).val();
		
		var ban = $( "#ban" ).val();
		
		var customer = $( "#cn" ).val();
		
		var cbr = $( "#tcbr" ).val();
		/*
		validate(customer, "#cbr", "please enter cbr");
		validate(agent, "#tan", "please enter agent name");
		validate(customer, "#cn", "please enter customer");
		validate(ban, "#ban", "please enter ban");
		*/
		var sep = " ";
		var text2 = $( "#dt option:selected" ).text();
		var text4 = $( "#l1 option:selected" ).text()  + " " + $( "#tt option:selected" ).text() + " ";
		var text5 =  $( "#td" ).val();
		var text = "Hi " + workgroup + sep + agent + sep + ban + sep + customer + sep + cbr;
		$("#prechat").fadeOut();
		$("#chat").fadeIn();
		send_msg(event, text);
	});
});

function send_chat_msg(event)
{
	var text = $("#input").val();
	var my_msg = "me123 ( " + Date() + " ) " + text;
	var styled_my_msg = "<div class='msgMe'>" + my_msg + "</div>";
	setResponse(styled_my_msg);
	$('#input').val('');
	send_msg(event, text);
}

function send_msg(event, text)
{
	event.preventDefault();
	send(text);
}

function validate (txt, tag, msg)
{
	if (txt.length == 0)
	{
		alert(msg);
		$(tag).parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Please enter email address</div>");
	}
}

function send(text) 
{
	
	$.ajax({
		type: "POST",
		url: baseUrl + "query?v=20150910",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		headers: {
			"Authorization": "Bearer " + accessToken
		},
		data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
		success: function(data) 
		{
			var json_str = JSON.stringify(data, undefined, 2);
			var json = $.parseJSON(json_str);
			$(json).each(function(i,val)
			{
			    $.each(val,function(k,v)
			    {
			          
			          if (k == 'result')
			          {
			        	  $(v).each(function(i1,val1)
			  			  {
			        		  $.each(val1,function(k1,v1)
			  				  {
			        			  if (k1 == 'fulfillment')
						          {
						        	  $(v1).each(function(i2,val2)
						  			  {
						        		  $.each(val2,function(k2,v2)
						  				  {
						        			  if ( k2 == "speech")
						        			  {
						        				  var bot_msg = "bot123 ( " + Date() + " ) " + v2;
						        				  var styled_bot_msg = "<div class='msgBot'>" + bot_msg + "</div>";
						        				  setResponse(styled_bot_msg); 
						        			  }
						  				  });
						  			  });
						          }
			  				  });
			  			  });
			          }
				});
			});
			
			
		},
		error: function() {
			setResponse("Internal Server Error");
		}
	});
}

function setResponse(val) 
{
	$('#chatbox').append($('<li>').html( val ));
	var objDiv = document.getElementById("chatbox");
	objDiv.scrollTop = objDiv.scrollHeight;
}
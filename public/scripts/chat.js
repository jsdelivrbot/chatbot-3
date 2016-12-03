var accessToken = "daca3cc0d46b4b9fa8e99d9f7cf24725";
var baseUrl = "https://api.api.ai/v1/";
var recognition;

$(function()
{
	send("Hi");
	
	$("#input").keypress(function(event) 
	{
		if (event.which == 13) 
		{
			send_msg(event);
		}
	});
	
	$("#submitmsg").click(function(event) 
	{
		send_msg(event);
	});
	
	$("#rec").click(function(event) 
	{
		switchRecognition();
	});
});

function send_msg(event)
{
	event.preventDefault();
	var text = $("#input").val();
	var my_msg = "me123 ( " + Date() + " ) " + text;
	var styled_my_msg = "<div class='msgMe'>" + my_msg + "</div>";
	setResponse(styled_my_msg);
	send(text);
}

function startRecognition() 
{
	recognition = new webkitSpeechRecognition();
	recognition.onstart = function(event) 
	{
		updateRec();
	};
	
	recognition.onresult = function(event) 
	{
		var text = "";
	    for (var i = event.resultIndex; i < event.results.length; ++i) 
	    {
	    	text += event.results[i][0].transcript;
	    }
	    setInput(text);
		stopRecognition();
	};
	
	recognition.onend = function() 
	{
		stopRecognition();
	};
	recognition.lang = "en-US";
	recognition.start();
}

function stopRecognition() {
	if (recognition) {
		recognition.stop();
		recognition = null;
	}
	updateRec();
}

function switchRecognition() 
{
	if (recognition) 
	{
		stopRecognition();
	}
	else 
	{
		startRecognition();
	}
}

function setInput(text) 
{
	$("#input").val(text);
	var txt = $("#input").val();
	send(txt);
}

function updateRec() 
{
	$("#rec").text(recognition ? "Stop" : "Speak");
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
}
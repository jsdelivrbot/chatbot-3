var accessToken = "daca3cc0d46b4b9fa8e99d9f7cf24725";
var baseUrl = "https://api.api.ai/v1/";
var recognition;

$(function()
{
	$("#chat").click(function(event) 
	{
		event.preventDefault();
		send();
	});
});

function send() 
{
	var text = "Hi " + $("#input").val();
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
						        				  setResponse("Bot123 (" + 	Date() + ") " + v2);  
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
	location.replace("chat.html");
}
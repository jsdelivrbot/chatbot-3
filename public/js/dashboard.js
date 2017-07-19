var socket = io.connect('/');
socket.on('message', function(txt)
{
	 var message = JSON.parse(txt);
	 switch(message.type)
	 {
	 	case "botMessage":
	 		var bot_msg = "bot123 ( " + formatDate(new Date()) + " ) " + message.val;
	 		var styled_bot_msg = "<div class='csiMsg'>" + bot_msg + "</div>";
	 		// alert(styled_bot_msg);
	 	break;
	 	case "logMessage":
	 		var msg = JSON.parse(message.val);
	 		add_log_message(msg.agent_id, msg.chat_id, msg.query, msg.reply, msg.intent);
	 	break;
	 }
	 
});

$(function()
{
	formatted_current_date();
	$("tr:even").css("background-color", "#eeeeee");
	$("tr:odd").css("background-color", "#ffffff");
});

Number.prototype.padLeft = function(base,chr){
	   var  len = (String(base || 10).length - String(this).length)+1;
	   return len > 0? new Array(len).join(chr || '0')+this : this;
	}

var formatDate = function() 
{
	var d = new Date,
    dformat = [ (d.getMonth()+1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('/')+
                ' ' +
              [ d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
	return dformat;
}

var add_log_message = function(agent_id, chat_id, query, reply, intent)
{
	var log_message = '<tr><th scope="row">' + agent_id + '</th><td>'+ chat_id + '</td><td>' + formatDate() + '</td><td>' + intent + '</td><td>' + query + '</td><td>' + reply + '</td></tr>';
	$('table tbody').append(log_message);
	document.getElementById('tbd').scrollTop = 10000;
}

var formatted_current_date = function()
{
	var m_names = new Array("Jan", "Feb", "Mar", 
			"Apr", "May", "Jun", "Jul", "Aug", "Sep", 
			"Oct", "Nov", "Dec");

	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();
	var fcd = "DATE : " + curr_date + "-" + m_names[curr_month] + "-" + curr_year;
	
	$('tfoot tr td').html(fcd);
}
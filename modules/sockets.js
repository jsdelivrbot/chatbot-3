var io = require('socket.io');

exports.initialize = function(server) 
{
  io = io.listen(server);
  io.sockets.on("connection", function(socket)
  {
	  var csi_data = 
	  {
	     val: "In case Smart Chat drops due to loss of connectivity or inactivity of 10 minutes, please do not hesitate to chat back in",
	     type:'progressMessage'
	  };
	  setInterval(function() 
	  {
		  io.sockets.send(JSON.stringify(csi_data));
      },6000000);
	  
      socket.on('message', function(txt)
      {
    	  var message = JSON.parse(txt);
    	  if(message.type == "userMessage")
    	  {
    		  console.log(message.val);
    		  var bot_data = 
	  		  {
	  		     val: message.val,
	  		     type:'botMessage'
	  		  };
    		  io.sockets.send(JSON.stringify(bot_data));
    	  }
      });
      
      socket.on('disconnect', function () 
      {
    	  io.sockets.send('user disconnected');
    	  console.log('user disconnected');
       });
  });
  
  return this;
}

exports.stream_log = function(msg) 
{
	 console.log("Log Message: " + msg);
	  var log_data = 
	  {
	     val: msg,
	     type:'logMessage'
	  };
	  io.sockets.send(JSON.stringify(log_data));
}

exports.stream_progress_message = function(msg) 
{
	console.log("Progress Message: " + msg);
	  var progress_data = 
	  {
	     val: msg,
	     type:'progressMessage'
	  };
	  io.sockets.send(JSON.stringify(progress_data));
}

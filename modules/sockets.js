var io = require('socket.io');

exports.initialize = function(server) 
{
  io = io.listen(server);
  io.sockets.on("connection", function(socket)
  {
	  var csi_data = 
	  {
	     val: "In case Smart Chat drops due to loss of connectivity or inactivity of 10 minutes, because the contexts expire,  please do not hesitate to chat back in",
	     type:'csiMessage'
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
  
}

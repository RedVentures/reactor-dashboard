// Dependencies
var Primus = require('primus');
var http = require('http');
var express = require("express");
var amqp = require("amqplib/callback_api");

var app = express ();



// Setting up Server that Loads the index.html page
app.use (express.static (__dirname));
var server = app.listen(12000, function () {
	console.log('express listening port 12000');
	console.log('host name', process.env.HOSTNAME);
});

// Setting up Primus Server
var primus = new Primus (server);
var timer;
var q = process.env.QNAME;
var user = process.env.USERNAME || "guest";
var password =  process.env.PASSWORD || "guest";
var host =  process.env.HOSTNAME || "127.0.0.1";
var rabbitport = process.env.RABBITPORT || 5672;
var vhost = process.env.VHOST  || "";



primus.on('connection', function (socket) {

// Consumer
function bail(err) {
  console.error(err);
  process.exit(1);
}

function consumer(conn) {
  var ok = conn.createChannel(on_open);
  function on_open(err, ch) {
  	console.log('created channel');
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
/*                  console.log(JSON.parse(msg.content.toString()));
                  console.log('\n');
                  console.log(msg.fields);
        socket.write(msg);
        ch.ack(msg);
                console.log('\n \n'); */

        // Creating New Event Type
        var input = JSON.parse(msg.content.toString());
        var output = {
                      meta: input.meta
                      };
        if (typeof(input.reactorMeta) != "undefined") {
          output.reactorMeta = input.reactorMeta;
        }
        else if (typeof(input.request) != "undefined"){
          output.reactorMeta = input.request.reactorMeta;
        }
        else {
          output.reactorMeta = false;
        }
        console.log(output);
        
        socket.write(output);
        ch.ack(msg);

        //-------------------------
      }
    });
  }
}

	amqp.connect('amqp://' + user + ':' + password + '@' + host + ':' + rabbitport + '/' + vhost, function(err, conn) {
	    console.log('connecter to rabbit');
	    if (err != null) bail(err);
	    consumer(conn);        
	  });

/*	console.log('primus has connected');
	var counter = 1;
	timer = setInterval(function () {
		// RANDOM CLASS AND NUMBER GENERATORS
		var type = ['A', 'B', 'C'];
		var rand = Math.floor((Math.random() * 3));
		socket.write( {
			id: counter, 
			name: (type[rand]),
			payload: {}
		});
		counter++;
		if (counter == 1000) {
			clearInterval(timer);
		}
	}, 40);
  /*
  var rabbitMq = require('rabbit-client')(connectionInfo);
  rabbitMq.listen(queuename, function (routingKey, payload) {
    socket.write({key: routingKey, payload: payload});
  })
*/

});

primus.on('disconnection', function () {
  clearInterval(timer);
});




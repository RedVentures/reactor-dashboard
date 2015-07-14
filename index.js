// Dependencies
var Primus = require('primus');
var http = require('http');
var express = require("express");
var amqp = require("amqplib/callback_api");
var mysql = require('mysql');

var app = express ();

// SEtting up mySQL connnection
var connection = mysql.createConnection(
    {
      host     : 'rv-clt-dbrope-dev01.redventures.net',
      user     : 'reactor_u',
      password : '*704ACFD896D3F071473B0456B4D32C9811F37E59',
      database : 'Reactor',
    }
);
connection.connect();


// Setting up Server that Loads the index.html page
app.use(express.static (__dirname));
var server = app.listen(12000, function () {
	console.log('express listening port 12000');
	console.log('host name', process.env.HOSTNAME);
});

/* Routes here */
// respond with "Hello World!" on the homepage
app.get('/SQL', function (req, res) {
  connection.query('SELECT * from reactorData', function(err, rows, fields) {
    if (!err)
      res.json(rows);
    else
      console.log('Error while performing Query.');
    });
});

/* End Routes */


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
    if (err !== null) bail(err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {

        // Creating New Event 
        var input = JSON.parse(msg.content.toString());
        //console.log(input);

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
          output.reactorMeta = false;        }



        // Pass information into mySQL server
        // creating variables to pass into database
        var date = new Date (output.meta.utc);
        date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var data = msg.content.toString();
        var agent = output.meta.agent.username || "";
        var company = output.reactorMeta.company || "";
        var topic = output.meta.topic;
        // quering data into database
        // formating data string:
        var escapeSql = function (val) {
          val = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
            switch (s) {
              case "\0":
                return "\\0";
              case "\n":
                return "\\n";
              case "\r":
                return "\\r";
              case "\b":
                return "\\b";
              case "\t":
                return "\\t";
              case "\x1a":
                return "\\Z";
              case "'":
                return "''";
              case '"':
                return '""';
              default:
                return "\\" + s;
            }
          });


          return val;
        };
        var dataForSQL = escapeSql(data);

        // performing query
        var queryString =  'INSERT INTO reactorData (Date, DateTime, Data, Agent, Company, Topic) VALUES ("' +date+'", "'+date+'", "'+dataForSQL+'", "'+agent.toString()+'", "'+company.toString()+'", "'+topic+'");';
        //console.log(queryString);
        connection.query(queryString, function(err, rows, fields) {
            if (err) throw err;
            else 
              console.log('database updated');
        });

        // adding properties to output in order to read in mySQL format on app side
        console.log(data);
        output.Date = date.split(' ')[0];
        output.DateTime = date;
        output.Data = data;
        output.Agent = agent;
        output.Company = company;
        output.Topic = topic;


        //console.log(output);
        // writing data into socket
        socket.write(output);
        ch.ack(msg);

        //-------------------------
      }
    });
  }
}

	amqp.connect('amqp://' + user + ':' + password + '@' + host + ':' + rabbitport + '/' + vhost, function(err, conn) {
	    console.log('connecter to rabbit');
	    if (err !== null) bail(err);
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




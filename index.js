/*
**  Topic: Reactor Dashboard   
**  Author: jortiz
**
**  Title: index
**  Function: Main_Index
**  Third Parities: 
**        * Primus
**        * http
**        * express
**        * amqp
**        * mysql
**
**  Description: The main index file is incharge of handling events: loading events from the mySQL Reactor Database, hearing to the events in real time, 
**                formatting them, adding them to the Database as well as pushing them through the socket.
**
*/

/* Initializing third party dependencies
/*_________________________________________________________________________________________________________________________________________________________________________ */
var Primus = require('primus');
var http = require('http');
var express = require("express");
var amqp = require("amqplib/callback_api");
var mysql = require('mysql'); 
var app = express ();

var mySQLhost = process.env.MYSQLHOST || "127.0.0.1";
var mySQLuser = process.env.MYSQLUSER || "user";
var mySQLpassword =  process.env.MYSQLPASSWORD || "password";
var mySQLdatabase = process.env.MYSQLDATABASE || "database";



/* Setting Up mySQL Database connectino
/*_________________________________________________________________________________________________________________________________________________________________________ */
var connection = mysql.createConnection(
    {
      host     : mySQLhost,
      user     : mySQLuser,
      password : mySQLpassword ,
      database : mySQLdatabase
    }
);
connection.connect();




/* SETTING UP SERVERS
/*_________________________________________________________________________________________________________________________________________________________________________ */

/* Setting up Server that Loads the index.html page
/*_________________________________________________________________________________________________________________________________________________________________________ */
app.use(express.static (__dirname));
var server = app.listen(12000, function () {
	console.log('express listening port 12000');
	console.log('host name', process.env.HOSTNAME1);
  console.log('host name', process.env.HOSTNAME2);
});

/* Setting up Primus 
/*_________________________________________________________________________________________________________________________________________________________________________ */
var primus = new Primus (server);
var timer;
var q = process.env.QNAME;
var user = process.env.USERNAME || "guest";
var password =  process.env.PASSWORD || "guest";
var host1 =  process.env.HOSTNAME1 || "127.0.0.1";
var host2 =  process.env.HOSTNAME2 || "127.0.0.1";
var rabbitport = process.env.RABBITPORT || 5672;
var vhost = process.env.VHOST  || "";

/* END SERVER SETUP
/*_________________________________________________________________________________________________________________________________________________________________________ */
/*_________________________________________________________________________________________________________________________________________________________________________ */




/* SETTING UP ROUTES
/*_________________________________________________________________________________________________________________________________________________________________________ */
/* Show all the Data obtained from the Database in the /SQL Route
/*_________________________________________________________________________________________________________________________________________________________________________ */
app.get('/SQL', function (req, res) {
  connection.query('SELECT * from reactorData', function(err, rows, fields) {
    if (!err)
      res.json(rows);
    else
      console.log('Error while performing Query.');
    });
});

/* END ROUTES SETUP 
/*_________________________________________________________________________________________________________________________________________________________________________ */
/*_________________________________________________________________________________________________________________________________________________________________________ */



/* Initializing Variables
    var previous -> Variable used to keep track of the date of the last event loaded. Helps set the date of a current event to the previous if the event 
                    does not have an explicit time stamp.

/*_________________________________________________________________________________________________________________________________________________________________________ */
var previous; 





/* UPON CONNECTION
/*_________________________________________________________________________________________________________________________________________________________________________ */

primus.on('connection', function (socket) {

/* Upon error, exit the program*/
function bail(err) {
  console.error(err);
  process.exit(1);
}


/* Setting Up Consumer */
function consumer(conn) {
  var ok = conn.createChannel(on_open);

  function on_open(err, ch) {
  	console.log('created channel');
    if (err !== null) bail(err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {                                           // Each message accounts for a n individual event
      if (msg !== null) { 

        /* If the Message is not null, it will perfrom the following:
              * Turn the message into a JSON, stores in the input variable.
              * A variable output is created, which will eventually be the one pushed through the socket. The output will contain many fields, in order for both old and new code 
                  to retrieve data from it. 
                  Old Code:  {
                              meta: 
                              reactorMeta: 
                              }
                  New Code:   {
                              Data:
                              Agent:
                              Company:
                              Topic:
                              Date:
                              DateTime:
                              }
              * Updates mySQL database with the New Code variables 
              * Pushes through the socket all of the output variable
        /*_________________________________________________________________________________________________________________________________________________________________________ */
                                                                     
          var input = JSON.parse(msg.content.toString());
          try {                                                // Try to perform all of the actions. If there is an error, in any part, it will not load the event.
            var output =  {meta: input.meta};                  // Errors would generate when incoming data does not have the expected format
            
            // Accounding for the different incoming formats (old Code)
            if (typeof(input.reactorMeta) != "undefined") {
              output.reactorMeta = input.reactorMeta;
            }
            else if (typeof(input.request) != "undefined"){
              output.reactorMeta = input.request.reactorMeta;
            }
            else {
              output.reactorMeta = false;
            }
            
            // Creating Date Variable (new data code)
            var date;
            try {
              //console.log(output.meta.utc);
              date = new Date (output.meta.utc);
            }
            catch (err) {
              date = new Date();
            }
            date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

            // Creating Other Variable (new data code) to insert into output code
            var data = msg.content.toString();
            var agent = output.meta.agent.username || "";
            var company = output.reactorMeta.company || "";
            var topic = output.meta.topic;
            
            // Function that helps JSON data object be apporpriatelly formated to be inserted and accessed from mySQL
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

            /* Performing query to Database (updating Database)
            /*_________________________________________________________________________________________________________________________________________________________________________ */
            var queryString =  'INSERT INTO reactorData (Date, DateTime, Data, Agent, Company, Topic) VALUES ("' +date+'", "'+date+'", "'+dataForSQL+'", "'+agent.toString()+'", "'+company.toString()+'", "'+topic+'");';
            connection.query(queryString, function(err, rows, fields) {
                if (err) throw err;
                else 
                  console.log('database updated', (new Date()).toJSON());
            });

            // Adding properties to output in order to read in 'mySQL structure' on app side
            output.Date = date.split(' ')[0];
            output.DateTime = date;
            output.Data = data;
            output.Agent = agent;
            output.Company = company;
            output.Topic = topic;

            /* Writing the output variable (the output event) into the socket
            /*_________________________________________________________________________________________________________________________________________________________________________ */
            socket.write(output);
            console.log('EVEN SENT TO DASHBOARD ', (new Date()).toJSON(), ' ',  output.Agent, ' ', output.Topic);
            ch.ack(msg);
          }
          catch (err){
            console.log('event not in expected format');            // When incoming msg does not have the expected format, the program will catch the error and console it to the screen
          }
       }
    });
  }
}

/* Upon Disconnection
/*_________________________________________________________________________________________________________________________________________________________________________ */
primus.on('disconnection', function () {
  clearInterval(timer);
});
/*_________________________________________________________________________________________________________________________________________________________________________ */
/*_________________________________________________________________________________________________________________________________________________________________________ */



/* SETTING UP RABBIT QUE CONNECTIONS
/*_________________________________________________________________________________________________________________________________________________________________________ */
	amqp.connect('amqp://' + user + ':' + password + '@' + host1 + ':' + rabbitport + '/' + vhost, function(err, conn) {
	    console.log('connected to rabbit 1');
	    if (err !== null) bail(err);
	    consumer(conn);        
	});

  amqp.connect('amqp://' + user + ':' + password + '@' + host2 + ':' + rabbitport + '/' + vhost, function(err, conn) {
      console.log('connected to rabbit 2');
      if (err !== null) bail(err);
      consumer(conn);        
  });
});






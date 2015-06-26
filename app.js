var app = angular.module("reactorDashboardApp", [
	'ngRoute', 
	"chart.js",
//	'events.fields',
	'events.events',
	'charts.barData',
	'charts.barGraph',
	'charts.chartsApp',
	'charts.pieChart'
	 ]);


app.config(['$routeProvider',
  function($routeProvider) {
	$routeProvider.
      when('/Graphs', {
        templateUrl: 'templates/Graphs.html'
      }).
      when('/Charts', {
        templateUrl: 'templates/Charts.html'
      }).
	  when('/EventsC', {
        templateUrl: 'templates/EventsC.html'
      }).
      when('/', {
      	templateUrl: 'templates/home.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


// -----------------------------------------
/*// --------- PRIMUS SERVER SEVICE ----------
app.service('Primus', function () {
	this.PrimusConnect = function () {
		Primus.connect('http://localhost:9000');
	};
 // primus  = Primus.connect('http://localhost:9000');

});

// ----------------------------------------- */

// -------- CONNECTION TO SERVER ESTABLISHED USING PRIMUS -----------------
//**
 	var primus  = Primus.connect('http://localhost:9000');
//**
//-------------------------------------------------------------------------

app.controller('MainController', ['$scope', '$timeout','barData', 'Events',
	function ($scope, $timeout, barData, Events) {

	$scope.count = 0;
  	//var primus  = Primus.connect('http://localhost:9000');
   	$scope.events = Events.getEvents();

   	var timer;

   primus.on('open', function () {
      console.log('i have connected');
      primus.on('data', function (data) { // triggers when you have an event
        //$scope.count ++;
        timer = $timeout( function() {
       		Events.addEvent(data);
        	$scope.events = Events.getEvents();
 			barData.updateData();
       });
        console.log('i have a message', data);
        //console.log(data);

      });
    });

   $scope.$on( "$destroy", function( event ) {
   	$timeout.cancel( timer );
   });

   $scope.createEvent = function () {
   	console.log('in here again');
   	$timeout( function() {
		Events.addEvent($scope.event);
        $scope.events = Events.getEvents();
		$scope.event = {};
	});
   };

}]);

// -------------------------------------------------------------







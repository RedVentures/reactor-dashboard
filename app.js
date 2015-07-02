var app = angular.module("reactorDashboardApp", [
	'ngRoute', 
	'chart.js',
	'amChartsDirective',
//	'events.fields',
	'events.events',
	'charts.barData',
	'charts.barGraph',
	'charts.chartsApp',
  'charts.graphsApp',
	'charts.pieChart',
  'charts.lineData',
	'charts.lineChart',
  'charts.lineChart2'
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

// -------- CONNECTION TO SERVER ESTABLISHED USING PRIMUS -----------------
//**
 	var primus  = Primus.connect('http://localhost:9000');
//**
//-------------------------------------------------------------------------

app.controller('MainController', ['$scope', '$rootScope', '$timeout','barData', 'Events', 
	function ($scope, $rootScope, $timeout, barData, Events) {

  // HTML VARIABLES
	$scope.count = 0;
  $scope.events = Events.getEvents();
  $scope.nmbrEvents = 5;
  $scope.orderProp = Date;

   	var timer;

   primus.on('open', function () {
      console.log('i have connected');
      primus.on('data', function (data) { // triggers when you have an event
        //$scope.count ++;
        timer = $timeout( function() {
       		Events.addEvent(data);
          Events.setCurrentEvent(data);
          Events.updateTopics();
        	$scope.events = Events.getEvents();
 			    barData.updateData();
          $rootScope.$broadcast('graph-updated');
        });
        console.log('i have a message', data, data.meta.utc);

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










//var primus  = Primus.connect('http://localhost:9000');

// -----------------------------------------
/*// --------- PRIMUS SERVER SEVICE ----------
app.service('Primus', function () {
  this.PrimusConnect = function () {
    Primus.connect('http://localhost:9000');
  };
 // primus  = Primus.connect('http://localhost:9000');

});

// ----------------------------------------- */






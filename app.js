var app = angular.module("reactorDashboardApp", [
	'ngRoute', 
	'chart.js',
	'amChartsDirective',
//	'events.fields',
  'SQLData.sqlSrvc',
  'SQLData.sqlCtrl',
	'events.events',
	//'charts.barData',
	//'charts.barGraph',
	'charts.chartsSrvc',
  'charts.chartsCtrl',
  'charts.graphsApp',
	//'charts.pieChart',
	//'charts.lineChart',
  'charts.lineData',
  'charts.lineChart2',
  'charts.pieChart2',
  'charts.pieChart2Data'
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
	  when('/Dashboard-Template', {
        templateUrl: 'templates/Dashboard-Template.html'
      }).
    when('/Mail', {
      templateUrl:'templates/Mail.html'
      }).
    when('/SQLEvents', {
      templateUrl:'templates/SQLEvents.html'
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
var primus  = Primus.connect('http://localhost:12000');
//**
//-------------------------------------------------------------------------

//------------------------------------------------------------------------

app.controller('MainController', ['$scope', '$rootScope', '$timeout', 'Events', 'lineData', 'sqlEvents',
	function ($scope, $rootScope, $timeout, Events, lineData, sqlEvents) {

  // HTML VARIABLES
	$scope.count = 0;
  $scope.events = Events.getEvents();
  $scope.nmbrEvents = 1000;
  $scope.orderProp = Date;
    
    $scope.listedTopics = lineData.getLoadedTopics();


    $scope.searchToogle = true;
    $scope.changeSearchToggle = function () {
      $scope.searchToogle = !($scope.searchToogle);
    };
    $scope.filterToogle = true;
    $scope.changeFilterToggle = function () {
      $scope.filterToogle = !($scope.filterToogle);
    };
    $scope.viewToogle = true;
    $scope.changeViewToggle = function () {
      $scope.viewToogle = !($scope.viewToogle);
    };

    $scope.eventToogle = true;
    $scope.changeEventToogle = function () {
      $scope.eventToogle = !($scope.eventToogle);
      console.log($scope.eventToogle);
    };


    $scope.sidebarToggle = true;
    $scope.changeSidebarToogle = function () {
      $scope.sidebarToggle = !($scope.sidebarToggle);
    };


    $scope.dashEventToggle = true;
    $scope.changeDashEventToggle = function () {
      $scope.dashEventToggle = !($scope.dashEventToggle);
    };

    $scope.dashChartsToggle = true;
    $scope.changeDashChartsToggle = function () {
      $scope.dashChartsToggle = !($scope.dashChartsToggle);
    };

    $scope.dashBarToggle = true;
    $scope.changeBarChartsToggle = function () {
      $scope.dashBarToggle = !($scope.dashBarToggle);
    };

    $scope.dashPieToggle = true;
    $scope.changePieChartsToggle = function () {
      $scope.dashPieToggle = !($scope.dashPieToggle);
    };

    $scope.dashLineToggle = true;
    $scope.changeLineChartsToggle = function () {
      $scope.dashLineToggle = !($scope.dashLineToggle);
    };







   var timer;
   primus.on('open', function () {
      sqlEvents.loadStoredEvents(function(data) {
        angular.forEach(data || [], function (event){
          event.Data = JSON.parse(event.Data);
        });
        sqlEvents.events = data;
        console.log(data);
        $rootScope.$broadcast('events-loaded');
      });
      var sqlIDCount = sqlEvents.events.length;
      
      console.log('i have connected');

      primus.on('data', function (data) { // triggers when you have an event
        //$scope.count ++;
        timer = $timeout( function() {
       		Events.addEvent(data);
          Events.setCurrentEvent(data);
          Events.updateTopics();
        	$scope.events = Events.getEvents();
          $rootScope.$broadcast('graph-updated');

          //

          data.Data = JSON.parse(data.Data);
          sqlIDCount ++;
          var newEvent = {
            ID: sqlIDCount,
            Date: data.Date,
            DateTime: data.DateTime,
            Data: data.Data,
            Agent: data.Agent, 
            Company: data.Company,
            Topic: data.Topic
          };
          sqlEvents.events.push(newEvent);
          sqlEvents.setCurrentEvent(newEvent);
          $rootScope.$broadcast('sqlEvent-added');

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






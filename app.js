/*
**  Topic: Reactor Dashboard   
**  Author: jortiz
**
**  Title: app
**  Function(s): Main_App | $routeProvider | MainController
**  Dependencies: 
**
**  Description: The app file controlls some variables shown in the front end and handles events. The app upon boot up, retrieves stored data from the mySQL database
**                and broadcsts a message so that controllers update the data services. In real time, it sets the current event to that of the incoming event and 
**                broadcasts a message so that other controllers can handle and update the different services. 
**
*/


var app = angular.module("reactorDashboardApp", [
	'ngRoute', 
	'chart.js',
	'amChartsDirective',
  'dateTimeSandbox',
//	'events.fields',
  'SQLData.allDataSrvc',
  'SQLData.sqlSrvc',
  'SQLData.sqlCtrl',
	'events.events',
  'charts.lineChartSrvc',
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
  'charts.pieChart2Data',
  'charts.lineChartSrvc',
  'modals.modalCtrl',
  'modals.modalSrvc',
  'SQLData.statsSrvc'
	 ]);

/* Setting up the view router
/*_________________________________________________________________________________________________________________________________________________________________________ */
app.config(['$routeProvider',
  function($routeProvider) {
	$routeProvider.
    when('/SQLDashboard-Template', {
      templateUrl:'templates/SQLDashboard-Template.html'
      }).
    when('/SQLEvents', {
      templateUrl:'templates/SQLEvents.html'
      }).
    when('/Stats', {
      templateUrl:'templates/Stats.html'
      }).
    when('/Charts', {
      templateUrl:'templates/Charts.html'
      }).
      when('/', {
      	templateUrl: 'templates/SQLDashboard-Template.html'
      }).
      otherwise({
        redirectTo: 'templates/SQLDashboard-Template.html'
      });
  }]);

app.run(function($rootScope) {
  $rootScope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
};
});

/* Setting up the primus connection
/*_________________________________________________________________________________________________________________________________________________________________________ */
var primus  = Primus.connect('http://localhost:12000');


app.controller('MainController', ['$scope', '$rootScope', '$timeout', 'Events', 'lineData', 'sqlEvents', 'allDataSrvc', 'chartsSrvc', 'lineChartSrvc', 'statsSrvc',
	function ($scope, $rootScope, $timeout, Events, lineData, sqlEvents, allDataSrvc, chartsSrvc, lineChartSrvc, statsSrvc) {

  /* $SCOPE VARIABLES AND FUCNTIONS: for UI functionality
    //  Variables and Fucntions that can be accessible and called upon on the UI.
  /*_________________________________________________________________________________________________________________________________________________________________________ */
  	$scope.count = 0;
    $scope.events = Events.getEvents();
    $scope.nmbrEvents = 1000;
    $scope.orderProp = "Date";
    $scope.listedTopics = lineData.getLoadedTopics();

    /* $scope Toogle Variables and Fucntions 
      //  Variables and Fucntions that controll what is shown in the front end. ng-view and ng-hide are used in the html to show and hide containers and buttons.
    /*_________________________________________________________________________________________________________________________________________________________________________ */
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

    $scope.sidebarToggle = false;
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


/* PRIMUS ON CONNECTION
      * Upon boot-up, the application will load all of the data into the allDataSrvc. The sqlEvents service (which contains the data that is seen in the front end), will get
        defaulted into all of the data. 
/*_________________________________________________________________________________________________________________________________________________________________________ */
   primus.on('open', function () {
      allDataSrvc.loadStoredEvents(function(data) {
        angular.forEach(data || [], function (event){
          try {
            event.Data = JSON.parse(event.Data);
          }
          catch(err) {
            var temp = new Date();
            temp = temp.toJSON;
            event.Data = {
              meta: {
                utc: temp
              }
            };
          }
          allDataSrvc.updateDataVariables(event);
        });
        allDataSrvc.events = data;
        sqlEvents.events = allDataSrvc.events;
        sqlEvents.lastFilteredData = allDataSrvc.events;  
        $rootScope.$broadcast('events-loaded');
      });
      console.log('i have connected');
    });



var timer;
/* PRIMUS ON DATA
      * When data (and event) comes in through the socket, the application will set the current event on both allDataSrvc and the sqlEvents services. The application will also
        push or add the events to the events variable in eahc of the services. For the allDataSrvc, we push the event, and for the sqlDataSrvc we call the addEvent function, as 
        this will add the event given the current filter settings.
      * When the real time event is successfully added to the different services, we broadcast a message, so that the charts controller can call the update the charts methods with
        the current event.
/*_________________________________________________________________________________________________________________________________________________________________________ */
   primus.on('open', function () {
    primus.on('data', function (data) { // triggers when you have an event
      //$scope.count ++;
      console.log('EVEN RECEIVED IN REACTOR DASHBOARD ', (new Date()).toJSON(), ' ', data.Agent, ' ', data.Topic);
      /*timer = $timeout( function() {
        Events.addEvent(data);
        Events.setCurrentEvent(data);
        Events.updateTopics();
        $scope.events = Events.getEvents();
        $rootScope.$broadcast('graph-updated');
      });*/
        //
        data.Data = JSON.parse(data.Data);
        var newEvent = {
          Date: data.Date,
          DateTime: data.DateTime,
          Data: data.Data,
          Agent: data.Agent, 
          Company: data.Company,
          Topic: data.Topic
        };
        var filterKey = sqlEvents.filterKey;
        allDataSrvc.events.push(newEvent);
        allDataSrvc.setCurrentEvent(newEvent);
        allDataSrvc.updateDataVariables(newEvent);
        if (sqlEvents.hasFilterProperties(newEvent)) {
          sqlEvents.addEvent(newEvent);
          statsSrvc.updateInfo(newEvent);
          $rootScope.$broadcast('sqlEvent-added');
        }

      
      console.log('i have a message', data, data.meta.utc);
    });
  });

/* Reload Data
      * When the filter function is clicked, all of the chart data is cleared and then regenerated with the new filters. A message is broadcast so that the charts controller 
      can call the update the charts methods with the current event.
/*_________________________________________________________________________________________________________________________________________________________________________ */
   $scope.$on("reload-data", function () {
    lineChartSrvc.lineData = {};
    lineChartSrvc.lineDataArr = [];
    lineChartSrvc.graphsArr = [];
    lineChartSrvc.loadedTopics = {};
    lineChartSrvc.loadedAgents = {};
    lineChartSrvc.loadedCompanies = {};
    chartsSrvc.pieData = {};
    chartsSrvc.pieDataArr = [];
    $scope.pageMessage = sqlEvents.filterMessage;
    console.log(sqlEvents.events);
    console.log('events loaded root call');
    $rootScope.$broadcast('events-loaded');
      
   });


  $scope.$on( "$destroy", function( event ) {
    $timeout.cancel( timer );
   });


}]);






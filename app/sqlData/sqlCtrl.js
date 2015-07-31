/*
**  Topic: Reactor Dashboard   
**  Author: jortiz
**
**  Title: SQLData.sqlCtrl
**  Function: Controller -> sqlCtrl
**  Dependencies: 
**
**  Description: This controllerhandels the variables related to the table and the event stream. It basically manages the variables and functions in the UI: it
**				listens to different broadcasts in order to update the data shown in the UI.
**
*/

angular.module('SQLData.sqlCtrl', [
	'SQLData.sqlSrvc',
  'SQLData.allDataSrvc',
  'SQLData.statsSrvc'
	])
	.controller ('sqlCtrl', [ '$scope','$rootScope', '$timeout', '$http', 'sqlEvents', 'allDataSrvc', 'statsSrvc',
	function ($scope, $rootScope, $timeout, $http, sqlEvents, allDataSrvc, statsSrvc) {
	
	/* Internal Fucntions 
		showInfo -> Function that is called when the controller is accessed in the UI and whene the program boots up.
    /*_________________________________________________________________________________________________________________________________________________________________________ */
	var showInfo = function () {
		  $scope.eventsSQL = sqlEvents.events;
		//console.log($scope.eventsSQL);
	  	$scope.nmbrEvents = 5;
	  	$scope.orderProp = "Date";
	    $scope.eventsSQLcount = $scope.eventsSQL.length;
      $scope.statsInfo = statsSrvc.info;
	};
	showInfo();

	/* $scope Refresh Fucntions 
			*  Upon different broadcasts, the controller updates the data shown in the front end.
    /*_________________________________________________________________________________________________________________________________________________________________________ */
	$scope.$on('events-loaded', function() {
		showInfo();
		$rootScope.$broadcast('frontEnd-events-loaded');
	 });

	$scope.$on('sqlEvent-added', function () {
			showInfo();
	});
































    /* $scope Toogle Variables and Fucntions 
			//  Variables and Fucntions that controll what is shown in the front end. ng-view and ng-hide are used in the html to show and hide containers and buttons.
    /*_________________________________________________________________________________________________________________________________________________________________________ */
	/*    $scope.searchToogle = true;
	    $scope.changeSearchToggle = function () {
	      $scope.searchToogle = !($scope.searchToogle);
	      if (!$scope.filterToogle) {$scope.filterToogle = !($scope.filterToogle);}
	      if (!$scope.viewToogle) {$scope.viewToogle = !($scope.viewToogle);}
	      

	    };
	    $scope.filterToogle = true;
	    $scope.changeFilterToggle = function () {
	      $scope.filterToogle = !($scope.filterToogle);
	      if (!$scope.searchToogle) {$scope.searchToogle = !($scope.searchToogle);}
	      if (!$scope.viewToogle) {$scope.viewToogle = !($scope.viewToogle);}
	    };
	    $scope.viewToogle = true;
	    $scope.changeViewToggle = function () {
	      $scope.viewToogle = !($scope.viewToogle);
	      if (!$scope.searchToogle) {$scope.searchToogle = !($scope.searchToogle);}
	      if (!$scope.filterToogle) {$scope.filterToogle = !($scope.filterToogle);}
	    };

	

	$scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };
	    $scope.date = {startDate: null, endDate: null};*/

	}]);
angular.module('SQLData.sqlCtrl', [
	'SQLData.sqlSrvc'
	
	])
	.controller ('sqlCtrl', [ '$scope','$rootScope', '$timeout', '$http', 'sqlEvents',

	function ($scope, $rootScope, $timeout, $http, sqlEvents) {

		//$scope.$on('events-loaded', function() {
			//$scope.events = sqlEvents.events();
			$scope.eventsSQL = sqlEvents.events;
		  	$scope.nmbrEvents = 1000;
		  	$scope.orderProp = Date;
		    $scope.eventsSQLcount = $scope.eventsSQL.length;
		    //$scope.listedTopics = lineData.getLoadedTopics();


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
		//});


		$scope.$on('sqlEvent-added', function () {
 			$scope.eventsSQLcount ++;
		});



	}]);
angular.module('charts.graphsApp', [])
	.controller ('graphsCrlt', [ '$scope', function ($scope) {
		
		$scope.barToggle = false;
		$scope.changeBarToggle = function () {
			$scope.barToggle = !($scope.barToggle);
		};
		$scope.pieToggle = false;
		$scope.changePieToggle = function () {
			$scope.pieToggle = !($scope.pieToggle);
		};
		$scope.lineToggle = false;
		$scope.changeLineToggle = function () {
			$scope.lineToggle = !($scope.lineToggle);
		};

		
//		$scope.setCurrentTemplate = function () {
//			$scope.chartTemplate = $scope.template.url;
//			console.log($scope.template);
//		};


	}]);
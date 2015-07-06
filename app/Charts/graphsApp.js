angular.module('charts.graphsApp', [])
	.controller ('graphsCrlt', [ '$scope', function ($scope) {
		
		$scope.barToggle = true;
		$scope.changeBarToggle = function () {
			$scope.barToggle = !($scope.barToggle);
		};
		$scope.pieToggle = true;
		$scope.changePieToggle = function () {
			$scope.pieToggle = !($scope.pieToggle);
		};
		$scope.lineToggle = true;
		$scope.changeLineToggle = function () {
			$scope.lineToggle = !($scope.lineToggle);
		};

		
//		$scope.setCurrentTemplate = function () {
//			$scope.chartTemplate = $scope.template.url;
//			console.log($scope.template);
//		};


	}]);
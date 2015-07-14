angular.module('charts.chartsCtrl', [
	'charts.chartsSrvc'
	])
	.controller ('chartsCtrl', [ '$scope','$rootScope', '$timeout', 'chartsSrvc',

	function ($scope, $rootScope, $timeout, chartsSrvc) {
		
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

		$scope.refreshPieData = function () {
			$scope.pieChart = chartsSrvc.getPieChart();
			$scope.pieChart.invalidateSize();
		    $scope.pieChart.write("SQLpiechartdiv");
		};
			

	chartsSrvc.loadStoredData();

	//=====================
	// PIE AND BAR CHART CONTROLLER 
	$scope.pieChart = chartsSrvc.getPieChart();
	console.log($scope.pieChart);
    $scope.pieChart.write("SQLpiechartdiv");
    $scope.pieChart.invalidateSize();
		

		$scope.$on('graph-updated', function() {
			console.log(chartsSrvc.getData());
		  	chartsSrvc.updateData();
		  	$scope.pieChart.dataProvider = chartsSrvc.getData();
		  	$scope.pieChart.validateData();
		  	$scope.pieChart.invalidateSize();
		  	//pieChart2Data.updateChart();
		  	//pieChart2Data.getChart();
		  });

	//=====================
	//=====================

	//=====================
	// LINE CHART CONTROLLER
	
	//=====================
	//=====================










	}]);
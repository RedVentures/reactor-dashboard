angular.module('charts.graphsApp', [
	'events.events',
	'charts.lineData',
	'charts.pieChart2Data'
	])
	.controller ('graphsCrlt', [ '$scope','$rootScope', '$timeout', 'Events', 'lineData', 'pieChart2Data',

	function ($scope, $rootScope, $timeout, Events, lineData, pieChart2Data) {
		
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

		$scope.refreshBarData = function () {
			$scope.barChart = pieChart2Data.getBarChart();
			$scope.barChart.invalidateSize();
		    $scope.barChart.write("barchartdiv");
		};
		$scope.refreshPieData = function () {
			$scope.pieChart = pieChart2Data.getPieChart();
			$scope.pieChart.invalidateSize();
		    $scope.pieChart.write("piechartdiv");
		};
		$scope.refreshLineData = function () {
			$scope.chart = lineData.getChart();
		    $scope.chart.write("chartdiv");
		    $scope.chart.invalidateSize();
		};
			
		$('#barModal').on('show.bs.modal', function (e) {
			alert('loadBarModal');
			$scope.barChart.invalidateSize();
		});


	//=====================
	// PIE AND BAR CHART CONTROLLER 
	$scope.pieChart = pieChart2Data.getPieChart();
    $scope.pieChart.write("piechartdiv");
    $scope.pieChart.validateData();
    $scope.pieChart.invalidateSize();

	$scope.barChart = pieChart2Data.getBarChart();
    $scope.barChart.write("barchartdiv");
    $scope.barChart.validateData();
    $scope.barChart.invalidateSize();
		


		$scope.$on('graph-updated', function() {
		  	pieChart2Data.updateData();
		  	$scope.pieChart.dataProvider = pieChart2Data.getData();
		  	$scope.barChart.dataProvider = pieChart2Data.getData();
		  	$scope.pieChart.validateData();
		  	$scope.barChart.validateData();
		  	$scope.pieChart.invalidateSize();
		  	$scope.barChart.invalidateSize();
		  	//pieChart2Data.updateChart();
		  	//pieChart2Data.getChart();
		  });

	//=====================
	//=====================

	//=====================
	// LINE CHART CONTROLLER
	$scope.chart = lineData.getChart();
    $scope.chart.write("chartdiv");
    $scope.chart.invalidateSize();
        
	var loadedTopics = lineData.getLoadedTopics();
	$scope.$on('graph-updated', function() {
		var currEvent = Events.getCurrentEvent();
       	var eventTopic = Events.getTopic(currEvent);
		if (!(loadedTopics[eventTopic])) {
			lineData.updateLoadedTopics(eventTopic);
			lineData.updateGraphs(eventTopic);
		}
		lineData.updateData();
        $scope.chart.graphs = lineData.getGraphs();
		$scope.chart.dataProvider = lineData.getData();
        //graphsArr = lineData.getGraphs();
		//lineDataArr = lineData.getData();
	    //chart.write("chartdiv");
		$scope.chart.validateData();
   		$scope.chart.invalidateSize();
		//chart.animateAgain();
	});	
	//=====================
	//=====================










	}]);
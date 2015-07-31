/*
**  Topic: Reactor Dashboard   
**  Author: jortiz
**
**  Title: charts.chartsCtrl
**  Function: Controllet -> chartsCtrl
**  Depenencies: charts.chartsSrv, charts.lineChartSrvc, SQLData.sqlSrvc
**  Description: The charts controller contains $scope variables that control different views of buttons and containers in the front end. The controller also
** 					listens to brodcasts and reloads the charts data when the events are loaded, filtered, and arriving in real time.
**              
*/


angular.module('charts.chartsCtrl', [
	'charts.chartsSrvc',
	'charts.lineChartSrvc',
	'SQLData.sqlSrvc'
	])
	.controller ('chartsCtrl', [ '$scope','$rootScope', '$timeout', 'chartsSrvc', 'lineChartSrvc', 'sqlEvents', 'statsSrvc',
	function ($scope, $rootScope, $timeout, chartsSrvc, lineChartSrvc, sqlEvents, statsSrvc) {


	/* $SCOPE VARIABLES AND FUCNTIONS: for UI functionality
			//  Variables and Fucntions that can be accessible and called upon on the UI.
    /*_________________________________________________________________________________________________________________________________________________________________________ */

    /* $scope Toogle Variables and Fucntions 
			//  Variables and Fucntions that controll what is shown in the front end. ng-view and ng-hide are used in the html to show and hide containers and buttons.
    /*_________________________________________________________________________________________________________________________________________________________________________ */
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

	$scope.lineSettings = false;
	$scope.lineSettingsChange = function () {
		$scope.lineSettings = !($scope.lineSettings);
	};
	$scope.showTime = false;
	$scope.showTimeChange = function () {
		$scope.showTime = !($scope.showTime);
	};

	$scope.pieSettings = false;
	$scope.pieSettingsChange = function () {
		$scope.pieSettings = !($scope.pieSettings);
	};
	$scope.barSettings = false;
	$scope.barSettingsChange = function () {
		$scope.barSettings = !($scope.barSettings);
	};

    /* $scope.setMaxInterval -> Fucntions that controlls the view of the lineChart. Upon the different cases, the function changes the lineChartSrvc.maxPeriodSelector to the 
    							number of milliseconds selected.
    /*_________________________________________________________________________________________________________________________________________________________________________ */
	$scope.setMaxInterval = function (interval) {
		var milliseconds = 0;
		switch(interval) {
			case 'M':
				milliseconds = 31*24*60*60*1000;
				break;
			case 'W':
				milliseconds = 7*24*60*60*1000;
				break;
			case 'D':
				milliseconds = 24*60*60*1000;
				break;
			case 'hr':
				milliseconds = 60*60*1000;
				break;
			case '30':
				milliseconds = 30*60*1000;
				break;
			case '5':
				milliseconds = 5*60*1000;
				break;
		}
		lineChartSrvc.maxPeriodSelector = milliseconds;
		$scope.SQLlineChart.maxSelectedTime = milliseconds;
		/* Upon each change made to the lineChart (and any chart), one has to call the .write(''), .validateData(), and .invalidateSize() methods 
		in order to ensure appropirate rendering.*/
		$scope.SQLlineChart.write("SQLlinechartdiv");
	    $scope.SQLlineChart.validateData();
	    $scope.SQLlineChart.invalidateSize();
	};

	/* $scope Refresh Fucntions 
			//  Fucntions that refresh the data and re-render the charts.
    /*_________________________________________________________________________________________________________________________________________________________________________ */
	$scope.refreshSQLPieData = function () {
		$scope.SQLpieChart = chartsSrvc.getPieChart();
	    $scope.SQLpieChart.write("SQLpiechartdiv");
	    $scope.SQLpieChart.validateData();
	    $scope.SQLpieChart.invalidateSize();
	};
	$scope.refreshSQLBarData = function () {
		$scope.SQLbarChart = chartsSrvc.getBarChart();
	    $scope.SQLbarChart.write("SQLbarchartdiv");
	    $scope.SQLbarChart.validateData();
	    $scope.SQLbarChart.invalidateSize();
	};
	$scope.refreshSQLLineData = function () {
		$scope.SQLlineChart =lineChartSrvc.getLineChart();
	    $scope.SQLlineChart.write("SQLlinechartdiv");
	    $scope.SQLlineChart.validateData();
	    $scope.SQLlineChart.invalidateSize();
	};


	/*_________________________________________________________________________________________________________________________________________________________________________ */
	/*_________________________________________________________________________________________________________________________________________________________________________ */


	/* $scope Variables that hold the charts shown in the UI
    /*_________________________________________________________________________________________________________________________________________________________________________ */
	$scope.SQLpieChart = chartsSrvc.getPieChart();
	$scope.SQLbarChart = chartsSrvc.getBarChart();
	$scope.SQLlineChart = lineChartSrvc.getLineChart();

	/* Fucntions accessible to the cotroller and foe its use
		// In order to ensure adequate rendering upon boot up and when the controller is accessed again and again from different html views, loadCharts function is called
			once upon bootup, when events are available.
    /*_________________________________________________________________________________________________________________________________________________________________________ */
	var loadedTopics = {};
	var loadCharts = function() {
		loadedTopics = lineChartSrvc.loadedTopics;
		//console.log(lineChartSrvc.lineData);
		if ((chartsSrvc.pieDataArr.length) === 0 && (lineChartSrvc.lineDataArr.length === 0)) {
			chartsSrvc.loadStoredData();
			lineChartSrvc.loadStoredData();

		}
		//console.log(statsSrvc.info);

		$scope.SQLpieChart.dataProvider = chartsSrvc.getData();
	    $scope.SQLpieChart.write("SQLpiechartdiv");
	    $scope.SQLpieChart.validateData();
	    $scope.SQLpieChart.invalidateSize();

	    
	    $scope.SQLbarChart.dataProvider = chartsSrvc.getData();
	    $scope.SQLbarChart.write("SQLbarchartdiv");
	    $scope.SQLbarChart.validateData();
	    $scope.SQLbarChart.invalidateSize();

	    $scope.SQLlineChart = lineChartSrvc.getLineChart();
	    $scope.SQLlineChart.graphs = lineChartSrvc.getGraphs();
	    //console.log(lineChartSrvc.getData());
		$scope.SQLlineChart.dataProvider = lineChartSrvc.lineDataArr;
		//console.log(lineChartSrvc.getData());
		//console.log(lineChartSrvc.getGraphs());
	    $scope.SQLlineChart.write("SQLlinechartdiv");
	    $scope.SQLlineChart.validateData();
	    //$scope.SQLlineChart.animateAgain();
	    $scope.SQLlineChart.invalidateSize();    
	};
	if(sqlEvents.events.length > 0) loadCharts();

	/*_________________________________________________________________________________________________________________________________________________________________________ */
	/*_________________________________________________________________________________________________________________________________________________________________________ */


	/* $scope.$on 
		// Sereis of functions that are called upon different broadcast messages coming from the app controller. 
			$rootScope.$broadcast(''), and $scope.$on('') are used to comunicate between controller. This ensures that data as well as the charts shown in front end
			are updated when: the program boots up, when the data is filtered, and when events come in real time.
    /*_________________________________________________________________________________________________________________________________________________________________________ */

	$scope.$on('frontEnd-events-loaded', function() {
		//console.log('events loaded here');
		loadCharts();
		statsSrvc.setInfo();
	});
	
	$scope.$on('sqlEvent-added', function() {
		//console.log(chartsSrvc.getData());
	  	chartsSrvc.updateData();
	  	$scope.SQLpieChart.dataProvider = chartsSrvc.getData();
	  	$scope.SQLpieChart.validateData();
	  	$scope.SQLpieChart.invalidateSize();

	  	$scope.SQLbarChart.dataProvider = chartsSrvc.getData();
	  	$scope.SQLbarChart.validateData();
	  	$scope.SQLbarChart.invalidateSize();

	});


	$scope.$on('sqlEvent-added', function() {
		lineChartSrvc.updateData();
		statsSrvc.setInfo();
		
		$scope.SQLlineChart.dataProvider = lineChartSrvc.lineDataArr;
		$scope.SQLlineChart.graphs = lineChartSrvc.getGraphs();
		$scope.SQLlineChart.validateData();
	    //$scope.SQLlineChart.animateAgain();
	    $scope.SQLlineChart.invalidateSize();  

	});


}]);
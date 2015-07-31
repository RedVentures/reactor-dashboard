angular.module( 'charts.lineChart2', [
	'events.events',
    'charts.lineData'
	])

  .controller ('LineCtrl2', ['$scope','$rootScope', '$timeout', 'Events', 'lineData',
	function ($scope, $rootScope, $timeout, Events, lineData) { 






		
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

	}]);


//var newColor = '#'+Math.floor(Math.random()*16777215).toString(16).toUpperCase();
//console.log(newColor);


// THIS CODE IS NOT BEING USED NOW
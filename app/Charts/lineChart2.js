angular.module( 'charts.lineChart2', [
	'events.events',
	'charts.barData',
    'charts.lineData'
	])

  .controller ('LineCtrl2', ['$scope','$rootScope', '$timeout','barData', 'Events', 'lineData',
	function ($scope, $rootScope, $timeout, barData, Events, lineData) { 
		
		var lineDataArr = lineData.getData();
		var graphsArr = lineData.getGraphs();
			

		chart = new AmCharts.makeChart("chartdiv", {
			type: "serial",
		    dataProvider: lineDataArr,
		    pathToImages: "http://www.amcharts.com/lib/images/",
		    legend: {
                    "useGraphSettings": true
                },
               categoryField: "date",
               rotate: false,
               zoomOutButton: {
                    backgroundColor: '#000000',
                    backgroundAlpha: 0.15
                },
            categoryAxis: {
                    minPeriod: "mm",
                    gridPosition: "start",
                    parseDates: true,
                    axisAlpha: 0,
                    fillAlpha: 0.05,
                    fillColor: "#000000",
                    gridAlpha: 0,
                    position: "top"
               },
            valueAxes: [{
                    axisAlpha: 0,
                    dashLength: 5,
                    minimum: 0,
                    position: "left",
                    title: "Counts"
             }],
            chartScrollbar: {
                    autoGridCount: true,
                    graph: "g1",
                    scrollbarHeight: 40,
                    color: "#FFFFFF",
                    dragIcon: "dragIconRoundSmallBlack"
            }, 
            mouseWheelZoomEnabled: true,
            chartCursor: {
            	cursorPosition: "mouse"
            },
            graphs: graphsArr
		});
		chart.validateData();

		var loadedTopics = lineData.getLoadedTopics();
		$scope.$on('graph-updated', function() {

			var currEvent = Events.getCurrentEvent();
        	var eventTopic = Events.getTopic(currEvent);
        	//var newColor = '#'+Math.floor(Math.random()*16777215).toString(16).toUpperCase();
        	//console.log(newColor);

			if (!(loadedTopics[eventTopic])) {

				lineData.updateLoadedTopics(eventTopic);
				lineData.updateGraphs(eventTopic);

			/*	var g = new AmCharts.AmGraph(eventTopic, {
                   	bullet: "round",
                   	title: eventTopic,
                   	valueField: eventTopic,
                   	fillColors: newColor,
                  	//fillAlphas: 0,
                  	//lineThickness: 2,
                  	balloonText: "[[title]] in [[category]]:<b>[[value]]</b>"
				});
			*/	
			//
			/*
				var g = new AmCharts.AmGraph();
				g.id = eventTopic;
				g.bullet = "round";
				g.title = eventTopic;
				g.valueField = eventTopic;
				//g.fillColors(newColor);
				//g.fillAlphas(0);
				//g.lineThickness(2);
				//g.balloonText("[[title]] in [[category]]:<b>[[value]]</b>");
				chart.addGraph(g);
			*/
			//
			}

			lineData.updateData();
			chart.graphs = lineData.getGraphs();
			chart.dataProvider = lineData.getData();
			chart.validateData();
		});

	}]);
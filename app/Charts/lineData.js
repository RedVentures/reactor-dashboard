angular.module( 'charts.lineData', [
	'events.events'
	])

  .factory('lineData', ['Events', '$rootScope', function (Events, $rootScope) {
	var self = {};

    var time = new Date();
    var lineData = {};
    var lineDataArr = [];
    var graphsArr = [];
    var loadedTopics = {};

    self.getData = function () {
        lineDataArr = [];
        for (var index in lineData){
            if (lineData.hasOwnProperty(index)){
                lineDataArr.push(lineData[index]);
            }
        }
        //console.log(lineDataArr);
		return lineDataArr;
	};

    self.updateData = function () {
	    var currEvent = Events.getCurrentEvent();
        var eventTopic = Events.getTopic(currEvent);
        var date = time;
        if (lineData[eventTopic]) {
            if (lineData[eventTopic][date]) {
                    lineData[eventTopic][date].value++;
                }
                else {
                    lineData[eventTopic][date] = {};
                    lineData[eventTopic][date].value = 1;
                }
        } else {
                lineData[eventTopic] = {};
                lineData[eventTopic][date] = {};
                lineData[eventTopic][date].value = 1;
                lineData[eventTopic][date].value = date;
        } 
    };

    self.getGraphs = function () {
        //console.log(graphsArr);
        return graphsArr;
    };

    self.updateGraphs = function(eventTopic) {
        var g = {};
            g.title = eventTopic;
            g.fieldMappings = [{fromField: "value", toField: "value"}];
            g.dataProvider = lineData[eventTopic];
            g.categoryField = "date";
            graphsArr.push(g);
    };

    self.getLoadedTopics = function () {
        return loadedTopics;
    };
    self.updateLoadedTopics = function (eventTopic) {
        loadedTopics[eventTopic] = eventTopic;
    };

    self.SetDefaults = function() {
        var date = time;
        angular.forEach(loadedTopics, function(eventTopic){
            lineData[eventTopic][date].count = 0;
        });
    };

    self.setTime = function () {
        time = new Date();
    };

    setInterval( function () {
        self.setTime();
        self.SetDefaults();
        console.log('time updated');
    }, 60000);  

    self.getChart = function (){
        return chart;
    };
   



    var chart = new AmCharts.AmSerialChart("chartdiv", {
        type: "stock",


        dataSetSelector: {
            position: "left"
        },

        dataSets: graphsArr,
        pathToImages: "http://www.amcharts.com/lib/images/",
        panels: [{
            legend: {},

            stockGraphs: [{
                id: "graph1",
                valueField: "value",
                type: "column",
                title: "MyGraph",
                fillAlphas: 1
            }]
        }],

        panelsSettings: {
            startDuration: 1
        },

        categoryAxesSettings: {
            dashLength: 5
        },

        valueAxesSettings: {
            dashLength: 5
        },

        chartScrollbarSettings: {
            graphType: "line"
        },

        chartCursorSettings: {
            valueBalloonsEnabled: true
        },

        periodSelector: {
            periods: [{
                period: "DD",
                count: 1,
                label: "1 day"
            }, {
                period: "DD",
                selected: true,
                count: 5,
                label: "5 days"
            }, {
                period: "MM",
                count: 1,
                label: "1 month"
            }, {
                period: "YYYY",
                count: 1,
                label: "1 year"
            }, {
                period: "YTD",
                label: "YTD"
            }, {
                period: "MAX",
                label: "MAX"
            }]
        }
    });
    chart.validateData();



 return self;
}]); 
























































/*    setInterval( function () {
        var newDate = new Date();
        object = {
            date: newDate,
            directory: 0,
            phonesystem: 0,
            troubleticket: 0,
            contactnote: 0

        };
        $scope.$on('graph-updated', function() {
            var currEvent = Events.getCurrentEvent();
            var eventDate = new Date(currEvent.meta.utc);
            var eventTopic = Events.getTopic(currEvent);
            object[eventTopic]++;
        });
        lineDataArr.push(object);
        chart.dataProvider = lineDataArr;
        chart.validateData();
        chart.animateAgain();
        console.log('chart updated');
    }, 60000);

    self.updateData = function () {

    };

	self.getData = function () {
		return lineDataArr;
	};



	return self;*/


/*



	var self = [];
	var events = Event.getEvents();
 	var lineDataArr = [];
    var lineData = {};
   // var origin = new Date();
    origin = origin.getMinutes();

       $scope.$on('graph-updated', function() {
       	 	var lineDataArr = [];
            var currEvent = Events.getCurrentEvent();
            var eventDate = new Date(currEvent.meta.utc);
            var eventMnt = eventDate.getMinutes();
            var eventTopic = Events.getTopic(currEvent);

            if (lineData[eventMnt]) {
                if (lineData[eventMnt][eventTopic]) {
                    lineData[eventMnt][eventTopic]++;
                }
                else {
                    lineData[eventMnt][eventTopic] = 1;
                }
            } else {
                lineData[eventMnt] = {};
                lineData[eventMnt][eventTopic] = 1;
                lineData[eventMnt].eventMnt = eventMnt;
            }

            for (var key in lineData) {
                console.log('push');
                lineDataArr.push( lineData[key] );
            }
            console.log(lineData);
            console.log(lineDataArr);
        });


    var origin = new Date();
    origin = origin.getMinutes();
	lineDataArr = [];
	setInterval( function () {
		mnt++;
		var newDate = new Date();
		newDate.setDate(getMinute() + mnt);
		
		object = {
			date: newDate,
			directory: 0,
			phonesystem: 0,
			troubleticket: 0
		};
		$scope.on('graph-updated', function() {
            var currEvent = Events.getCurrentEvent();
            var eventDate = new Date(currEvent.meta.utc);
            var eventTopic = Events.getTopic(currEvent);
            object[eventTopic]++;
		});
		chart.dataProvider.push(object);
        chart.validateData();
        chart.animateAgain();
	}, 1000);

*/
























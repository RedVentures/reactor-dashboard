angular.module( 'charts.lineData', [
	'events.events'
	])

  .factory('lineData', ['Events', '$rootScope', function (Events, $rootScope) {
	var self = [];

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
        if (lineData[date]) {
            if (lineData[date][eventTopic]) {
                    lineData[date][eventTopic]++;
                }
                else {
                    lineData[date][eventTopic] = 1;
                }
        } else {
                lineData[date] = {};
                lineData[date][eventTopic] = 1;
                lineData[date].date = date;
        }  
    };

    self.getGraphs = function () {
        //console.log(graphsArr);
        return graphsArr;
    };

    self.updateGraphs = function(eventTopic) {
        var g = new AmCharts.AmGraph();
            g.id = eventTopic;
            g.bullet = "round";
            g.title = eventTopic;
            g.valueField = eventTopic;
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

        if (!lineData[date]){
            lineData[date] = {date: date};
        }
        angular.forEach(loadedTopics, function(eventTopic){
            lineData[date][eventTopic] = 0;
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
   



    var chart = new AmCharts.makeChart("chartdiv", {
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
            scrollbarHeight: 20,
            "oppositeAxis":false,
            "offset":10,
            "backgroundAlpha": 0,
            "selectedBackgroundAlpha": 0.1,
            "selectedBackgroundColor": "#888888",
            "graphFillAlpha": 0,
            "graphLineAlpha": 0.5,
            "selectedGraphFillAlpha": 0,
            "selectedGraphLineAlpha": 1,
            "autoGridCount":true,
            "color":"#AAAAAA",
            "autoMargins":false
        }, 
        mouseWheelZoomEnabled: true,
        chartCursor: {
            cursorPosition: "mouse"
        },
        addClassNames: true,
        graphs: graphsArr
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
























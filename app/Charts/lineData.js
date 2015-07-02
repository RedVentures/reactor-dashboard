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
        /*angular.forEach (lineData || {}, function (value, key) {
            lineDataArr.push(value);
        });*/
        for (var index in lineData){
            if (lineData.hasOwnProperty(index)){
                lineDataArr.push(lineData[index]);
            }
        }
        console.log(lineDataArr);
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
        //console.log('event came in ' + eventTopic +' lineData updated' + time);  
        console.log(lineData);      
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
        console.log(loadedTopics);
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
























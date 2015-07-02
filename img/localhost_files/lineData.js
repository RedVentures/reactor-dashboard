angular.module( 'charts.lineData', [
	'events.events'
	])

  .factory('lineData', ['Events', '$rootScope', function (Events, $rootScope) {
	var self = [];


	var origin = new Date();
    origin = origin.getMinutes();
    var lineDataArr = [];
    var mnt = 0;
    var lineData = {};
    var object =  {};

    self.getData = function () {
		return lineDataArr;
	};

	self.stat = function () {
	    origin = origin.getMinutes();
	    setInterval( function () {
	        var newDate = new Date();
	        // CALL GRAPH UPDATE lineChart.updateChart();
	        console.log('chart updated');
	    }, 60000);  
	};

    self.updateData = function () {
	    var currEvent = Events.getCurrentEvent();
        var date = new Date(currEvent.meta.utc);
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
    };

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
























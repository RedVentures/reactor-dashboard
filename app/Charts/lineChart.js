angular.module( 'charts.lineChart', [
	'events.events',
	'charts.barData',
    'charts.lineData'
	])

  .controller ('LineCtrl', ['$scope', '$timeout','barData', 'Events', 'lineData',
	function ($scope, $timeout, barData, Events, lineData) {  
       chart = new AmCharts.makeChart("chartdiv", {
               type: "serial",
                legend: {
                    "useGraphSettings": true
                },
               theme: "light",
               dataProvider: lineDataArr,
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
               graphs: [{
                   id: "g1",
                   bullet: "round",
                   title: "TroubleTicket",
                   valueField: "troubleticket",
                   fillColors: "#ADD981",
                   fillAlphas: 0,
                   lineThickness: 2,
                   balloonText: "[[title]] in [[category]]:<b>[[value]]</b>"
               }, {
                   bullet: "round",
                   title: "Directory",
                   valueField: "directory",
                   fillColors: "#00CED1",
                   fillAlphas: 0,
                   lineThickness: 2,
                   balloonText: "[[title]] in [[category]]:<b>[[value]]</b>"            
               }, {
                   bullet: "round",
                   title: "ContactNote",
                   valueField: "contactnote",
                   fillColors: "#00CED1",
                   fillAlphas: 0,
                   lineThickness: 2,
                   balloonText: "[[title]] in [[category]]:<b>[[value]]</b>"            
               }, {
                   bullet: "round",
                   title: "PhoneSystem",
                   valueField: "phonesystem",
                   fillColors: "#DC143C",
                   fillAlphas: 0,
                   lineThickness: 2,
                   balloonText: "[[title]] in [[category]]:<b>[[value]]</b>"
               }],
                chartScrollbar: {
                    autoGridCount: true,
                    graph: "g1",
                    scrollbarHeight: 40,
                    color: "#FFFFFF",
                    dragIcon: "dragIconRoundSmallBlack"
               }, 
                mouseWheelZoomEnabled: true

            });
           // var currTime = new Date();
           // var currMinutes = currTime.getMinutes();





/*
    var lineDataArr = lineData.getData();
    setInterval( function () {
        var newDate = new Date();
        $scope.$on('graph-updated', function() {
            lineData.updateData(newDate);
        });
        chart.dataProvider = lineData.getData();
        chart.validateData();
        chart.animateAgain();
        console.log('chart updated');

    }, 60000);
*/


    var origin = new Date();
    origin = origin.getMinutes();
    var lineDataArr = [];
    var mnt = 0;
    setInterval( function () {
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
























/*
       var lineDataArr = [];
       var lineData = {};
       var origin = new Date();
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
                    console.log('in if if');
                }
                else {
                    lineData[eventMnt][eventTopic] = 1;
                    console.log('in if else');
                }
            } else {
                console.log('in else');
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
            chart.dataProvider = lineDataArr;
            chart.validateData();
            chart.animateAgain();
        });
            //console.log(eventMnt);
            //console.log(Events.getAllEventTopics());
*/



	}]);

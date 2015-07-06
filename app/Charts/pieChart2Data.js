angular.module( 'charts.pieChart2Data', [
	'events.events'
	])

  .factory('pieChart2Data', ['Events', '$rootScope', function (Events, $rootScope) {
	
    var self = [];
    var pieData = {};
    var pieDataArr = [];
    
    chart = new AmCharts.makeChart( "chartdiv", {
        type: "pie",
        theme: "light",
        dataProvider: pieDataArr,
        valueField: "value",
        titleField: "label",
        export: {
            "enabled": true
          }
    });


    self.getChart = function () {   
        console.log(chart);
        return chart;
    };

    self.updateChart = function(){
        pieDataArr = [];
        for (var index in pieData){
            if (pieData.hasOwnProperty(index)){
                pieDataArr.push(pieData[index]);
            }
        }
        chart.validateData();
    };

    self.getData = function () {
        pieDataArr = [];
        for (var index in pieData){
            if (pieData.hasOwnProperty(index)){
                pieDataArr.push(pieData[index]);
            }
        }
        return pieDataArr;
	};

    self.updateData = function () {
	    var currEvent = Events.getCurrentEvent();
        var eventTopic = Events.getTopic(currEvent);

        if (pieData[eventTopic]) {
            pieData[eventTopic].value ++ ;
        } else {
            pieData[eventTopic] = {};
            pieData[eventTopic].value = 1;
            pieData[eventTopic].label = eventTopic;
        }
        console.log(pieData);      
    };



    return self;

}]); 
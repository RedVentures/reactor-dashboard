angular.module( 'charts.chartsSrvc', [
	'SQLData.sqlSrvc'
	])

  .factory('chartsSrvc', ['sqlEvents', '$rootScope', function (sqlEvents, $rootScope) {
	
    var self = [];
    var pieData = {};
    var pieDataArr = [];



    self.loadStoredData = function () {
      var events = sqlEvents.events;
      angular.forEach (events || [], function (event) {
        eventTopic = event.Topic;
        if (pieData[eventTopic]) {
            pieData[eventTopic].value ++ ;
        } else {
            pieData[eventTopic] = {};
            pieData[eventTopic].value = 1;
            pieData[eventTopic].label = eventTopic;
        }
      });
      console.log(pieData);
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
	      var currEvent = sqlEvents.getCurrentEvent();
        var eventTopic = currEvent.Topic;
        //var newColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        if (pieData[eventTopic]) {
            pieData[eventTopic].value ++ ;
        } else {
            pieData[eventTopic] = {};
            pieData[eventTopic].value = 1;
            pieData[eventTopic].label = eventTopic;
        }
      //  console.log(pieData);      
    };

    self.getPieChart = function () {
        return pieChart;
    };

    pieChart = new AmCharts.makeChart( "SQLpiechartdiv", {
        type: "pie",
        theme: "light",
        "startDuration": 0,
        "addClassNames": true,
        "legend":{
          "position":"bottom",
          "marginRight":100,
          "autoMargins":false
        },
        //"innerRadius": "30%",
        "defs": {
        "filter": [{
          "id": "shadow",
          "width": "200%",
          "height": "200%",
          "feOffset": {
            "result": "offOut",
            "in": "SourceAlpha",
            "dx": 0,
            "dy": 0
          },
          "feGaussianBlur": {
            "result": "blurOut",
            "in": "offOut",
            "stdDeviation": 5
          },
          "feBlend": {
            "in": "SourceGraphic",
            "in2": "blurOut",
            "mode": "normal"
          } 
        }] },
        labelsEnabled: false,
        autoMargins: false,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        pullOutRadius: 10,
        "autoMargins": false,
        dataProvider: pieDataArr,
        valueField: "value",
        titleField: "label",
        export: {
            "enabled": true
          },
        "autoMargins": false
    });
    pieChart.validateData();
    pieChart.invalidateSize();



    return self;

}]); 
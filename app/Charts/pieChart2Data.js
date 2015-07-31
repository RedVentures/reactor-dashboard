angular.module( 'charts.pieChart2Data', [
	'events.events'
	])

  .factory('pieChart2Data', ['Events', '$rootScope', function (Events, $rootScope) {
	
    var self = [];
    var pieData = {};
    var pieDataArr = [];


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
        var newColor = '#'+Math.floor(Math.random()*16777215).toString(16);
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

    pieChart = new AmCharts.makeChart( "piechartdiv", {
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

    self.getBarChart = function () {
        return barChart;
    };

    barChart = new AmCharts.makeChart( "barchartdiv", {
      "type": "serial",
      "theme": "light",
      rotate: false,
      "dataProvider": pieDataArr,
      "valueAxes": [ {
        "title": "Count",
        "gridColor": "#FFFFFF",
        "gridAlpha": 0.2,
        "dashLength": 0
      } ],
      "gridAboveGraphs": true,
      "startDuration": 1,
      "graphs": [ {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "fillAlphas": 0.8,
        "lineAlpha": 0.2,
        "type": "column",
        "valueField": "value"
       // "fillColors": ["#FF0F00", "#FF6600", "#FF9E01", "#FCD202", 
         //            "#F8FF01", "#B0DE09", "#04D215", "#0D8ECF", 
           //          "#0D52D1", "#2A0CD0", "#8A0CCF", "#CD0D74"]
      } ],
      "chartCursor": {
        "categoryBalloonEnabled": false,
        "cursorAlpha": 0,
        "zoomable": false
      },
      "categoryField": "label",
      "categoryAxis": {
        "title": "Event Type",
        "gridPosition": "start",
        "gridAlpha": 0,
        "tickPosition": "start",
        "tickLength": 20,
        "labelRotation": 45
      },
      "export": {
        "enabled": true
      }

    });
    barChart.invalidateSize();
    barChart.validateData();





















    return self;

}]); 
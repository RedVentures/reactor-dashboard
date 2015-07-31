/*
**  Topic: Reactor Dashboard   
**  Author: jortiz
**
**  Title: charts.chartsSrvc
**  Function: Service -> chartsSrvc
**  Depenencies: SQLData.sqlSrvc
**  Description: The following service keeps track and stores the data used to fill the barChart and the pieChart.
**              It also creates the charts. Only one service was used for both bar and pie charts as they use the same data with the dame format. 
*/

angular.module( 'charts.chartsSrvc', [
	'SQLData.sqlSrvc'
	])

  .factory('chartsSrvc', ['sqlEvents', '$rootScope', function (sqlEvents, $rootScope) {
	
    /* Initializing Variables 
        self.pieData -> Object that contains different objects for each different topic. Each object is taged with its Topic, and contains fields value and label, which correspond
                            to the count and the topic. 
        self.pieDataArr -> Array composed of the individual objects contained in the self.pieData object:
                          * In order to parse through the different dates in an efficinet manner; objects where used in order to take advantage 
                            of "id'ing"  the objects in order to make parsing easier (see self.loadData and self.updateData to see how the app parses through data).
    /*_________________________________________________________________________________________________________________________________________________________________________ */

    var self = {};
    self.pieData = {};
    self.pieDataArr = [];

    /* Service Functions 
        self.loadStoredData -> Function that is called upon boot up of the program and it will parse through the stored data and populate the lineData object with the minutes and its
                                respective value fields. The function will read each event stored, look at its topic, and it will increment the count of that particular
                                topic inside the corresponding topic. 
        self.getData -> Function that parses through the pieData object and updates the pieDataArr with the objects contained in the lineData object. The pieChart and barChart data
                                has to be in the format of an array: [{data} {data} {data} .... ]
        self.updateData -> Function that is called in the charts controller when an event comes in real time. The function looks at the current event's topic and updates 
                                the particular value value within its corresponding topic in the piData object. 
        self.getPieChart -> Function that returns the SQLpieChart.
        self.getBarChart -> Function that returns the SQLbarChart.
    /*_________________________________________________________________________________________________________________________________________________________________________ */

    self.loadStoredData = function () {
      var events = sqlEvents.events;
      var filteredEvents = sqlEvents.filteredEvents;



      //console.log(sqlEvents.events);
      angular.forEach (events || [], function (event) {
        var eventTopic = sqlEvents.getTopic(event);
        //console.log(eventTopic);
        if (self.pieData[eventTopic]) {
            self.pieData[eventTopic].value ++ ;
        } else {
            self.pieData[eventTopic] = {};
            self.pieData[eventTopic].value = 1;
            self.pieData[eventTopic].label = eventTopic;
        }
        //console.log(pieData[eventTopic]);
      });

      //console.log(pieData);
    };


    self.getData = function () {
        self.pieDataArr = [];
        for (var index in self.pieData){
            if (self.pieData.hasOwnProperty(index)){
                self.pieDataArr.push(self.pieData[index]);
            }
        }
        return self.pieDataArr;
	};

    self.updateData = function () {
	      var currEvent = sqlEvents.getCurrentEvent();
        var eventTopic = sqlEvents.getTopic(currEvent);
        if (self.pieData[eventTopic]) {
            self.pieData[eventTopic].value ++ ;
        } else {
            self.pieData[eventTopic] = {};
            self.pieData[eventTopic].value = 1;
            self.pieData[eventTopic].label = eventTopic;
        }
      //  console.log(pieData);      
    };

    self.getPieChart = function () {
        return SQLpieChart;
    };

    self.getBarChart = function () {
        return SQLbarChart;
    };

    /* Other internal varaibles 
        SQLpieChart -> Variable that contains the pieChart.
        SQLbarChart -> Variable that contains the barChart. It is defined to be a AmCharts Object, whose settings can be easily edited. For API reference:
                        //------------------------------------------------------------------------
                        //------------ http://docs.amcharts.com/3/javascriptcharts ---------------
                        //------------------------------------------------------------------------
    /*_________________________________________________________________________________________________________________________________________________________________________ */    

    SQLpieChart = new AmCharts.makeChart( "SQLpiechartdiv", {
        type: "pie",
        theme: "light",
        "startDuration": 0,
        "addClassNames": true,
        //"innerRadius": "30%",
        "legend": { 
          "divId": "SQLpielegenddiv",
          "position":"bottom",
          "marginRight":100,
          "autoMargins":false
        },
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
        colors: ['#006dcc', '#1a94ff', '#7ec3ff', '#b8deff', '#f3faff', '#004480', '#476885', '#00ccc5', '#00807b', '#002e56' ],
        labelsEnabled: false,
        autoMargins: false,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        pullOutRadius: 10,
        "autoMargins": false,
        dataProvider: self.pieDataArr,
        valueField: "value",
        titleField: "label",
        export: {
            "enabled": true,
            "libs": {"autoLoad": false}
          },

    });

    SQLbarChart = new AmCharts.makeChart( "SQLbarchartdiv", {
      "type": "serial",
      "theme": "light",
      rotate: false,
      "dataProvider": self.pieDataArr,
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
      } ],
      colors: ['#006dcc', '#1a94ff', '#7ec3ff', '#b8deff', '#f3faff', '#004480', '#476885', '#002e56', '#00ccc5', '#00807b'],
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
        "enabled": true,
        "libs": {"autoLoad": false}
      }

    });

    // Fucntions from the amCharts modules that need to be called in order to appropriately render and have the chart show on the UI.
    SQLpieChart.validateData();
    SQLpieChart.invalidateSize();
    SQLbarChart.invalidateSize();
    SQLbarChart.validateData();



    return self;

}]); 
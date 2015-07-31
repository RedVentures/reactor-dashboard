/*
**  Topic: Reactor Dashboard   
**  Author: jortiz
**
**  Title: charts.lineChartSrvc
**  Function: Service -> lineChartSrvc
**  Depenencies: SQLData.sqlSrvc
**  Description: The following service keeps track and stores the data used to fill the lineChart.
**              It also creates the lineChart. 
**
*/

angular.module( 'charts.lineChartSrvc', [
	'SQLData.sqlSrvc'
	])

  .factory('lineChartSrvc', ['sqlEvents', '$rootScope', function (sqlEvents, $rootScope) {

    /* Initializing Variables 
        var time -> Date object created to keep track of time once the aplication boots up.
        var lastLoadDate -> Variable that keeps track of the last date containing an event. This variable is important, as it helps self.loadStoredData and 
                            self.updateData set the defaults of minutes that do not contain any events.
        self.lineData -> Object that contains different objects with a date id (granulated to the minute), and properties:
                          * date
                          * for each topic registered, there will be a property with a number value, which represents the number of events
                            of that type in the minute it is contained
        self.lineDataArr -> Array composed of the individual objects contained in the self.lineData object:
                          * In order to parse through the different dates in an efficinet manner; objects where used in order to take advantage 
                            of "id'ing"  the objects in order to make parsing easier (see self.loadData and self.updateData to see how the app parses through data)
        self.graphsArr -> Array that contains the graph placeholders for the data used to create the lineChart. The amCharts third party module used to 
                            create the line chart is requests data and graphs. AmCharts will ceate a chart that will act as a cancas, on which you will insert the graphs.
                            The graphs need to match perfectly with the value fields found in the created objects in the lineDataArr. In order to do so, self.lodedTopics were 
                            updated synchronously as data is read from the loaded data and as events come real time.
        self.loadedTopics, 
        self.loadedAgents, 
        self.loadedCompanies -> Objects ceated in order to keep track of the loaded variables. They are composed of keys with the same name as the value string.

    /*_________________________________________________________________________________________________________________________________________________________________________ */

    var self = {};
    var time = (new Date()).toJSON();
    var lastLoadDate = {};

    self.lineData = {};
    self.lineDataArr = [];
    self.graphsArr = [];

    self.loadedTopics = {};
    self.loadedAgents = {};
    self.loadedCompanies = {};

    

    /* Internal Functions
        var eliminateSec -> Function that eliminates the seconds and milliseconds from the date passed in as a paramerter. If a Date Object is passed in as a parameter, it wil change
                            it to a string and take out the seconds. The function returns a string of a date without the seconds and milliseconds.
    /*_________________________________________________________________________________________________________________________________________________________________________ */
    self.eliminateSec = function (date) {
        var arr;
        if (date instanceof Object){
            date.toJSON();
            arr = date.split(':');
            return (arr[0] + ':' + arr[1]);
        }
        else {
            arr = date.split(':');
            return (arr[0] + ':' + arr[1]);
        }
    };
    time = new Date(self.eliminateSec(time));


    /* Service Functions 
        self.loadStoredData -> Function that is called upon boot up of the program and it will parse through the stored data and populate the lineData object with the minutes and its
                                respective value fields. The function will read each event stored, look at the date and its topic, and it will increment the count of that particular
                                topic inside the corresponding minute. When there is date for which an object has not been created, it will analyze the minute gap there is in between 
                                events and fill them with empty objects, with value fields for previously loaded events with zero as count. This is necessary in order for the line chart
                                to default to zero when there are no events in a particular minute. The self.setDefaults fucniton will take care of defaulting the values of an object to zero.
        self.getLineChart -> Function that returns the lineChart created at the end of the service. One could use self.lineChart in order to register the line chart, but the earlier method
                                was used in order to keep it consistent among the other chart services. 
        self.getData -> Function that parses through the lineData object and updates the lineDataArr with the objects contained in the lineData object. As explained earlier, the lineChart
                                data has to be in the format of an array: [{data} {data} {data} .... ]
        self.updateData -> Function that is called in the charts controller when an event comes in real time. The function looks at the current event's date and its topic and updates 
                                the particular topic value within its corresponding minute date in the lineData object. The function as well analyzes if there is a gap in between the last date 
                                with event and the currernt event date. If there is, the fucntion will set the deafaults of those minutes; it will assign a value of zero to all of the 
                                already registered topics. 
        self.getGraphs -> Function that returns self.graphArr. This functions is not necessary, as one can call self.graphArr in order to access the graphs.
        self.updateGraphs -> Function that creates a new graph whenever it is called. A strung with the eventTopic is passed as a parameter. The functions is only called when a new unregistered
                                evenTopic comes in.
        self.SetDefaults -> Function that takes in a date as a string parameter and creates an object inside the dataArr object with the parameter (date) as a tag or id and contains
                                the date and for each registered topic a value of zero.
        self.refreshSettings -> Fucntion that resets the lineChart's view. It sets the view to a minumum of 5 minutes and a maximum of 30 minutes.


    /*_________________________________________________________________________________________________________________________________________________________________________ */


    self.loadStoredData = function () {
        var events = sqlEvents.events;
        //console.log(events);
        var oldDate = '';
        var firstDate = new Date(self.eliminateSec(events[0].Data.meta.utc));  
        
        var lastDate = new Date(self.eliminateSec(events[events.length-1].DateTime));
        var dateCount = firstDate.getTime();
        var tempDate = firstDate;
        
        angular.forEach(events || [],function (event) {
            var eventTopic = sqlEvents.getTopic(event);
            var date;
            try {
                date = self.eliminateSec(event.Data.meta.utc);
            }
            catch(err) {
                date = event.Data.meta.utc;
            }
            date = new Date(date);
           
            if (self.lineData[date]) {
                if (self.lineData[date][eventTopic]) {
                        self.lineData[date][eventTopic]++;
                        tempDate = date;
                        lastLoadDate = date;
                    }
                else {
                    self.lineData[date][eventTopic] = 1;
                    tempDate = date;
                    lastLoadDate = date;
                }
            } else {
                // If we have a new minute, we push the last minute Object into the lineDataArr
                if (self.lineData[lastLoadDate]){  
                    self.lineDataArr.push(self.lineData[lastLoadDate]);
                }
                

                var startTime = tempDate.getTime() + 60000;
                var endTime = date.getTime();

                for (var i=startTime; i<endTime; i+=60000){
                    var newDate = new Date(i);
                    self.SetDefaults(newDate);
                    self.lineDataArr.push(self.lineData[newDate]); // If we have a new minute, we push the last minute Object into the lineDataArr
                }
                lastLoadDate = date;

                self.lineData[date] = {};
                self.SetDefaults(date);
                self.lineData[date][eventTopic] = 1;
                self.lineData[date].date = date;
                    
            }  

            if (!(self.loadedTopics[eventTopic])) {
                self.loadedTopics[eventTopic] = eventTopic;
                self.updateGraphs(eventTopic);
            }

            var agent = event.Agent;
            if (!(self.loadedAgents[agent])) {
                self.loadedAgents[agent] = agent;
            }
            var company = event.Company;
            if (!(self.loadedCompanies[company])) {
                self.loadedCompanies[company] = company;
            }
        });
        self.lineDataArr.push(self.lineData[lastLoadDate]); // If we have a new minute, we push the last minute Object into the lineDataArr
    };

    self.getLineChart = function () {
        return chart;
    };

    self.getData = function () {
        //console.log(self.lineData);
        self.lineDataArr = [];
        for (var index in self.lineData){
            if (self.lineData.hasOwnProperty(index)){
                self.lineDataArr.push(self.lineData[index]);
            }
        }
        //console.log(self.lineDataArr);
		return self.lineDataArr;
	};

    self.updateData = function () {

        var currEvent = sqlEvents.getCurrentEvent();
        var eventTopic = sqlEvents.getTopic(currEvent);

        if (!(self.loadedTopics[eventTopic])) {
            self.loadedTopics[eventTopic] = eventTopic;
            self.updateGraphs(eventTopic);
        }

        var date = new Date ( self.eliminateSec(currEvent.Data.meta.utc));
        var startTime = lastLoadDate.getTime() + 60000;
        var endTime = date.getTime();
        //console.log(currEvent);
        
        

        for (var i=startTime; i<(endTime+60000); i+=60000){
            var newDate = new Date(i);
            self.SetDefaults(newDate);
            self.lineDataArr.push(self.lineData[newDate]);  // If we have a new minute, we push the last minute Object into the lineDataArr

        }    

        if (self.lineData[date]) {
            if (self.lineData[date][eventTopic]) {
                    self.lineData[date][eventTopic]++;
                    self.lineDataArr.pop();
                    self.lineDataArr.push(self.lineData[date]);
                }
                else {
                    self.lineData[date][eventTopic] = 1;
                    self.lineDataArr.pop();
                    self.lineDataArr.push(self.lineData[date]);
                }
        } else {
                self.lineDataArr.push(self.lineData[lastLoadDate]); // If we have a new minute, we push the last minute Object into the lineDataArr
                self.lineData[date] = {};
                self.lineData[date][eventTopic] = 1;
                self.lineData[date].date = date;
        } 
        lastLoadDate = new Date(date); 
        //console.log(self.lineDataArr);
    };

    self.getGraphs = function () {
        //console.log(graphsArr)
        return self.graphsArr;
    };

    self.updateGraphs = function(eventTopic) {
        var g = new AmCharts.AmGraph();
            g.id = eventTopic;
            g.bullet = "round";
            g.title = eventTopic;
            g.valueField = eventTopic;
            self.graphsArr.push(g);
        //console.log(self.graphsArr[0]);
        console.log(self.graphsArr);
    };


    self.SetDefaults = function(date) {

        if (!self.lineData[date]){
            self.lineData[date] = {date: date};
        }
        angular.forEach(self.loadedTopics, function(eventTopic){
            self.lineData[date][eventTopic] = 0;
        });
    };

    self.refreshSettings = function () {
        self.maxPeriodSelector = 1800000;
        self.minPeriodSelector = 300000;
    };
   
    self.maxPeriodSelector = 1800000;
    self.minPeriodSelector = 300000;

    /* Other internal varaibles 
        var chart -> Variable that contains the lineChart. It is defined to be a AmCharts Object, whose settings can be easily edited. For API reference:
                        //------------------------------------------------------------------------
                        //------------ http://docs.amcharts.com/3/javascriptcharts ---------------
                        //------------------------------------------------------------------------
        setInterval -> A miunte interval used to keep track of time upon boot up. It was used to set the future defaults of lineChart, but the defaults were refactored to be
                        set inside the self.loadData and self.updateData fucntions.
    /*_________________________________________________________________________________________________________________________________________________________________________ */

    var chart = new AmCharts.makeChart("SQLlinechartdiv", {
        type: "serial",
        dataProvider: self.lineDataArr,
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
         colors: ['#006dcc', '#1a94ff', '#7ec3ff', '#b8deff', '#f3faff', '#004480', '#476885', '#00ccc5', '#00807b', '#002e56' ],
        chartScrollbar: {
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
        maxSelectedTime: self.maxPeriodSelector,
        minSelectedTime: self.minPeriodSelector,
        

        addClassNames: true,
        graphs: self.graphsArr,
        export: {
            "enabled": true,
            "libs": {"autoLoad": false},

          }
    });
    chart.validateData();


    setInterval( function () {
        time = (new Date((new Date()).getTime()).toJSON());
        time = new Date(self.eliminateSec(time));
       // alert('time updated ' + time);
        //self.SetDefaults(time);
        //console.log(self.lineData.length);
        //console.log(self.lineData);
    }, 60000);  



 return self;
}]); 
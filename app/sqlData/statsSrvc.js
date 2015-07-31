/*
**  Topic: Reactor Dashboard   
**  Author: jortiz
**
**  Title: SQLData.allDataSrvc
**  Function: Service -> allDataSrvc
**  Depenencies: allDataSrvc
**  Description: The following service keeps track and stores all of the data obtained from the mySQL database.
**
*/

angular.module('SQLData.statsSrvc', [])
  .factory('statsSrvc', ['$http', 'sqlEvents', 'lineChartSrvc', function ($http, sqlEvents, lineChartSrvc) {

    /* Initializing Variables 
    /*_________________________________________________________________________________________________________________________________________________________________________ */    
    var self = {};
    self.info = {};

    self.setInfo = function () {
        angular.forEach (lineChartSrvc.lineData || {}, function (dateEvent) {
            angular.forEach(lineChartSrvc.loadedTopics || {}, function (loadedTopic) {
                if (dateEvent[loadedTopic]){
                    if(self.info[loadedTopic]) {
                        self.info[loadedTopic].count += dateEvent[loadedTopic];  // total number of even of that type
                        if (dateEvent[loadedTopic] !== 0) {                      // if value is zero, do not count that iteration
                            self.info[loadedTopic].iteration ++;             // total number of iterations
                        }
                        self.info[loadedTopic].average = (self.info[loadedTopic].count / self.info[loadedTopic].iteration).toFixed(2);
                    }
                    else {
                        self.info[loadedTopic] = {};
                        self.info[loadedTopic]['topic'] = loadedTopic;
                        self.info[loadedTopic]['count'] =  dateEvent[loadedTopic];
                        if (dateEvent[loadedTopic] !== 0) {
                            self.info[loadedTopic]['iteration'] = 1;
                        }
                        else {
                            self.info[loadedTopic]['iteration'] = 0;
                        }
                        self.info[loadedTopic]['average']  = (self.info[loadedTopic].count / self.info[loadedTopic].iteration).toFixed(2);
                    }
                }
            });
        });
    };

    var lastLoadDate = "";

    self.updateInfo = function (event) {
        var date = lineChartSrvc.eliminateSec((new Date()).toJSON());
        var eventTopic = sqlEvents.getTopic(event);
            if(self.info[eventTopic]) {
                self.info[eventTopic].count ++;  // total number of even of that type
                if (date !== lastLoadDate) {                      // if it is not the same date
                    self.info[eventTopic].iteration ++;             // total number of iterations
                }
                self.info[eventTopic].average = (self.info[eventTopic].count / self.info[eventTopic].iteration).toFixed(2);
            }
            else {
                self.info[eventTopic] = {};
                self.info[loadedTopic]['topic'] = loadedTopic;
                self.info[eventTopic]['count'] =  dateEvent[eventTopic];
                self.info[eventTopic]['iteration'] = 1;
                self.info[eventTopic]['average']  = (self.info[eventTopic].count / self.info[eventTopic].iteration).toFixed(2);
            }
        //console.log(self.info);

    };


    return self;

  }]);
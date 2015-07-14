angular.module('SQLData.sqlSrvc', [])
  .factory('sqlEvents', ['$http', function ($http) {
    
    var self = {};
    var currentEvent = {};
    var topics = {};

    self.events = [];
    

    self.loadStoredEvents = function(callback) {
      return $http.get('/SQL').success(callback);
    };
      

    self.updateTopics = function () {
      var topic = self.getTopic(currentEvent);
      if (topics[topic]){
        topics[topic].count ++;
      } else {
        topics[topic] = {
          name: topic,
          count: 1
        };
      }
    };

    self.getTopics = function () {
      return topics;
    };


    self.setCurrentEvent = function (data) {
      currentEvent = data;
    };
    self.getCurrentEvent = function () {
      return currentEvent;
    };

    // Getting Meta Properties
    self.getUTC = function (event) {
      return event.Data.meta.utc;
    };

      // Time Functions 
      self.getEventsByType = function (type) {
        eventType = [];
        angular.forEach(self.events || [], function (event) {
          if (getEventTopic(event) === type)
            eventType.push(event);
          return eventType;
        });
      };


    self.getTopic = function (event) {
      var tempStr = event.Topic;
      var tempArr = tempStr.split(".");
      return tempArr[0] || "";
    };
    self.getEventAgent = function (meta) {
      return event.Agent || "";
    };
    self.getCompany = function (event) {
      return event.Company || "";
    };

    return self;

  }]);
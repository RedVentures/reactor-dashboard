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

angular.module('SQLData.allDataSrvc', [])
  .factory('allDataSrvc', ['$http', function ($http) {

    /* Initializing Variables 
    var currentEvent -> Variable that keeps track of the current topic.
    self.events -> Object that contains the event objects.
    self.loadedTopics 
    self.loadedAgents 
    self.loadedCompanies -> Objects that keep track of the loaded topics, agents, and companies. This info is used by tyhe filter modal in order to control the different
                    filter option checkboxes.
    /*_________________________________________________________________________________________________________________________________________________________________________ */    
    var self = {};
    var currentEvent = {};
    self.events = {}; //[]
    self.loadedTopics = {};
    self.loadedAgents = {};
    self.loadedCompanies = {};

   /* Service Functions 
    self.loadStoredData -> Upon boot up, the funtoin is called. A callback is passed as a parameter. See the app.js to see the internals of the function. Basically, the function returns 
                        The data contained in the mySQL database. In the app.js, for each row in the database, an event object is ceated and pushed into self.events.
    self.updateDataVariables -> Function that takes in an event as a parameter and updates the self.loadedTopics, self.loadedAgents, and self.loadedCompanies objects.
    self.setCurrentEvent -> Fucntion that sets the currentEvent variable to the event passed in as a parameter.
    self.getCurrentEvent -> Fucntion that returns the currentEvent variable.
    /*_________________________________________________________________________________________________________________________________________________________________________ */

    self.loadStoredEvents = function(callback) {
      return $http.get('/SQL').success(callback);
    };

    self.updateDataVariables = function (event) {
    	var topic = event.Topic.split('.')[0];
    	if (!(self.loadedTopics[topic])) {
	        self.loadedTopics[topic] = topic;
	    }
	    var agent = event.Agent;
	    if (!(self.loadedAgents[agent])) {
	        self.loadedAgents[agent] = agent;
	    }
	    var company = event.Company;
	    if (!(self.loadedCompanies[company])) {
	        self.loadedCompanies[company] = company;
	    }
    };

    self.setCurrentEvent = function (data) {
      currentEvent = data;
    };
    self.getCurrentEvent = function () {
      return currentEvent;
    };


    return self;

  }]);
/*
**  Topic: Reactor Dashboard   
**  Author: jortiz
**
**  Title: SQLData.sqlSrvc
**  Function: Service -> sqlEvents
**  Depenencies: allDataSrvc
**  Description: The following service keeps track and stores the data shown in the front end, different to the allDataSrvc that contains all the data.
**
*/



angular.module('SQLData.sqlSrvc', [])
  .factory('sqlEvents', ['$http', 'allDataSrvc', 'modalSrvc', function ($http, allDataSrvc, modalSrvc) {

   /* Initializing Variables 
    var lastFilteredTopic -> Variable that keeps track of the last giltered topic. 
    self.events -> Object that contains the event objects.
    self.filterKey -> Variable that keep track of the filterKey. This variable is set in the modal controller, where the filter is found.
    self.filterOption -> Variable that keep track of the filterOption. THhs variable is set in the modal controller, where the filter is found.
    self.topicFilterOption -> Variable that keep track of the topicFilterOption. This variable is set in the modal controller, where the filter is found. This variable is important
                              as it changes how granular you get when organizing data by topic.
    self.lastFilteredData -> Array that contains the data of the last filtered data. It is used within the self.filterData() fucntion.
    self.filterMessage -> String that keeps track of the filter message that shows up on the top right corner of the navigation bar.
    /*_________________________________________________________________________________________________________________________________________________________________________ */
    
    var self = {};
    var currentEvent = {};
    var lastFilterTopic = "";

    self.events = {};
   // self.filteredEvents = [];
    self.filterKey = "";
    self.filterOption = "";
    self.topicFilterOption = "one"; 
    self.lastFilteredData = [];
    self.filterMessage = "// ";



    /* Service Functions 
    self.loadStoredData -> 
    self.filterEvents -> Function that filters the data shown in the UI. The function is called multiple times within the filter modal controller. The function filters self.events.  
                          For each agent, company, and/or topic selected in checkbox form found in the modal.
                          Variables used: 
                            * var filteredEvents -> Temporary variable intrinsic to the function that keeps track of the filtered events when the lastFilterTopic changes value.
                                                This will refresh each time the function is called and will conatain filtered data to which self.events is set equal to.
                            * var lastFilterTopic -> Variable that keeps track of the last filtered topic. This value would vary between Agent, Company, and Topic. When the value changes
                                                the function will register into self.lastFilteredData self.events, and then filter the data, save it into filteredEvents, 
                                                and then equal self.events to that filteredEvents variable.  When the value of lastFilterTopic does not change, the function will filter
                                                the self.lastFilteredData but instead of saving it into the temporary filteredEvents variable, it will push the events into the 
                                                self.lastFilteredData. At the end, self.events will equal filteredEvents, which updated all along the way inside the function.
                            * self.lastFilteredData -> Objects upon which the data filtered. It keeps track of the filtered data. See the description above to understand its role in the function. 
    self.addEvent -> Function that is called in the controller. The function looks into the allDataSrvc for the current event, and adds it to the self.events if its data matches the filter settigs.
                           An event is passed in as a parameter.
    self.getCurrentEvent -> Function that returns the current event from the allDataSrvc service if it its data matches the filter settigs.
    self.getUTC -> Function that returns the UTC of an event object. An event is passed in as a parameter.
    self.getTopic -> Function that returns the topic of a particular event. A case statement is built into it as we want to be able to change how granular we get a topic.
                          A topic contains different atributes, all separated by dots. The split function is called and upon how much of the topic you want to get, you will see. 
                          The self.topicFilterOption variable keeps track of the granularity levels. If you want to see the whole message, you set self.topicFilterOption to 'all'.
                          Usually, self.topicFilterOption is set to 'one', as we want to aonly see the main info for a particualt topic. For example, one will get you directory, and all will
                          return directory.get. When we access the third filtering level('Agent', 'Company', and' 'Topic') , upon we will filter upon the topic field, if a topic is selected, the 
                          self.topicFilterOption will be set to 'all', so that the charts show granulat data.  An event is passed in as a parameter.
    self.getEventAgent -> Function that return the agent for a particular event. An event is passed in as a parameter.
    self.getCompany -> Fucntion that returns the company for a given event. An event is passed in as a parameter.
    /*_________________________________________________________________________________________________________________________________________________________________________ */

    /* self.loadStoredEvents = function(callback) {
      return $http.get('/SQL').success(callback);
    }; */

    self.filterEvents = function () {
      var filteredEvents = [];
      //alert(self.events.length);

      if(self.filterOption === 'refresh' || self.filterOption === ""){
          //alert('inside refresh');
        self.events = allDataSrvc.events;
        lastFilterTopic = "";
      }
      else if (self.filterKey !== ""){
        //alert(lastFilterTopic + " ==? "+ self.filterOption);
        //console.log(self.filterOption + ' ' + self.filterKey);
        if (lastFilterTopic === ""  || lastFilterTopic === self.filterOption) {
          //alert('filtering ' + self.filterOption + ' ' + self.filterKey );
          angular.forEach(self.lastFilteredData || [], function (event){  
            switch (self.filterOption) {
              case 'Agent':
                if((event[self.filterOption] ) === self.filterKey){
                  filteredEvents.push(event); 
                  self.events.push(event);
                  //console.log('pushing');
                }
                break;
              case 'Company':
                if((event[self.filterOption]) === self.filterKey){
                  filteredEvents.push(event); 
                  self.events.push(event);
                  //console.log('pushing');
                }
                break;
              case 'Topic':
                if((event[self.filterOption].split('.')[0] ) === self.filterKey.split('.')[0]){
                  filteredEvents.push(event); 
                  self.events.push(event);
                  //console.log('pushing');
                }
                break;
            }
          }); 
          lastFilterTopic = self.filterOption;
        }
        else if (lastFilterTopic !== self.filterOption){
          ///alert('new filterOption');
          //alert('filtering ' + self.filterOption + ' ' + self.filterKey );

          self.lastFilteredData =  self.events;

          angular.forEach(self.lastFilteredData || [], function (event){  
            switch (self.filterOption) {
              case 'Agent':
                if((event[self.filterOption] ) === self.filterKey){
                  filteredEvents.push(event);
                  console.log('pushing');
                }
                break;
              case 'Company':
                if((event[self.filterOption]) === self.filterKey){
                  filteredEvents.push(event); 
                  console.log('pushing');
                }
                break;
              case 'Topic':
                if((event[self.filterOption].split('.')[0] ) === self.filterKey.split('.')[0]){
                  filteredEvents.push(event); 
                  console.log('pushing');
                }
                break;
            }
          }); 
          lastFilterTopic = self.filterOption;
          self.events = filteredEvents;
        }
      }
        //alert(self.events.length);
    };
    // Function that aids in getting adding and getting current event 
    var miniFilter = function (checkboxForm, filterOption, event) {
        var temp = false;
        if (filterOption != 'Topic'){
          if ( (checkboxForm[event[filterOption].split('.')[0]]) ===true ){
            temp = true;
          }
        }
        else {
          if (checkboxForm[event[filterOption]]===true ){
            temp = true;
          }
        }
        return temp;
      };

    self.hasFilterProperties = function (inputEvent) {  // True will allow for the events to be updated
      if (miniFilter( modalSrvc.agentCheckbox, 'Agent', inputEvent) || miniFilter( modalSrvc.topicCheckbox, 'Topic', inputEvent) || miniFilter( modalSrvc.topicCheckbox, 'Topic', inputEvent) ){
        return true;
      }
      else {
        var isFilter = modalSrvc.isFilter;
        if (!(isFilter)) { return true;}
        else {return false;}
      }
    };

    self.addEvent = function (inputEvent) {
      self.events.push(inputEvent);
    };

    self.getCurrentEvent = function () {
      //alert(allDataSrvc.getCurrentEvent().Agent);
      return allDataSrvc.getCurrentEvent();
    };

    // Getting Meta Properties
    self.getUTC = function (event) {
      return event.Data.meta.utc;
    };

    self.getTopic = function (event) {
      var tempStr = event.Topic;
      var tempArr = tempStr.split(".");
      switch (self.topicFilterOption) {
        case 'one':
          return tempArr[0] || "";
        case 'two':
          return (tempArr[0] + tempArr[1]) || "";
        case 'all':
          return  event.Topic;
      }
    };
    self.getEventAgent = function (meta) {
      return event.Agent || "";
    };
    self.getCompany = function (event) {
      return event.Company || "";
    };

    return self;

  }]);
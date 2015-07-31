/*
**  Topic: Reactor Dashboard   
**  Author: jortiz
**
**  Title: modals.modalCtrl
**  Function: Controllet -> modalCtrl
**  Depenencies: charts.lineChartSrvc, SQLData.sqlSrvc
**  Description: The modal controller contains $scope variables that control different views of buttons and containers in the front end. The controller's main
** 					function is to contain the variables and functions that help the user filter the data.
**              
*/


angular.module('modals.modalCtrl', [
	'charts.lineChartSrvc',
	'SQLData.sqlSrvc',
	'modals.modalSrvc'
	])
	.controller ('modalCtrl', [ '$scope','$rootScope', '$timeout','lineChartSrvc', 'sqlEvents', 'allDataSrvc', 'modalSrvc',

	function ($scope, $rootScope, $timeout, lineChartSrvc, sqlEvents, allDataSrvc, modalSrvc) {

	/* $SCOPE VARIABLES AND FUCNTIONS: for UI functionality
			//  Variables and Fucntions that can be accessible and called upon on the UI.
    /*_________________________________________________________________________________________________________________________________________________________________________ */
		$scope.loadedTopics = allDataSrvc.loadedTopics;
		$scope.loadedAgents = allDataSrvc.loadedAgents;
		$scope.loadedCompanies = allDataSrvc.loadedCompanies;
		$scope.filterKeys = { Agent: "", Copmany: "", Topic: ""};
		$scope.agentCheckbox = {};
		$scope.companyCheckbox = {};
		$scope.topicCheckbox = {};

		// Refresh function -> Function that simply reserts all the sqlEvents.filterOption, sqlEvents.filterKey, and sqlEvents.filterMessage. Both functions broadcast 
		//						'reload-data' so that all the data gets reloaded.
		$scope.refreshData = function () {
			sqlEvents.events = [];
			sqlEvents.topicFilterOption = "one";
			sqlEvents.filterKey = "";
			sqlEvents.filterOption = "refresh";
			sqlEvents.filterEvents();
			sqlEvents.filterMessage = "// ";
			$scope.agentCheckbox = {};
			$scope.companyCheckbox = {};
			$scope.topicCheckbox = {};

			modalSrvc.agentCheckbox = $scope.agentCheckbox;
			modalSrvc.companyCheckbox = $scope.companyCheckbox;
			modalSrvc.topicCheckbox = $scope.topicCheckbox;
			modalSrvc.isFilterOption = {'Agent': false, 'Company': false, 'Topic': false};
			modalSrvc.isFilter = false;

			$rootScope.$broadcast('reload-data');
		};

		// Filter fucntion -> For each  selected checkbox, the filter function will change the sqlEvents.filterOption, sqlEvents.filterKey, and call the sqlEvents.filterEvents() function.
		//						The function will also add all the selected information to the sqlEvents.filterMessage, which is the one shown in the top right hand, in the navigation bar.					
		$scope.filter = function () {
			//alert($scope.agentCheckbox.jortiz);
			// Storing Filter Options in a service so that events can be filteres in real time as well. This inforamation is read by the sqlSrvc
			modalSrvc.agentCheckbox = $scope.agentCheckbox;
			modalSrvc.companyCheckbox = $scope.companyCheckbox;
			modalSrvc.topicCheckbox = $scope.topicCheckbox;

			sqlEvents.events = [];
			sqlEvents.filterOption = "Agent";
			var message = '';
			angular.forEach($scope.agentCheckbox || [], function (value, key) {
				if($scope.agentCheckbox[key]===true) {
					sqlEvents.topicFilterOption = "one";
					sqlEvents.filterKey = key;
					sqlEvents.filterEvents();
					modalSrvc.isFilter = true;
					modalSrvc.isFilterOption['Agent'] = true ;
					//sqlEvents.filterMessage += (sqlEvents.filterKey + ' | ');
					message += sqlEvents.filterKey + ' | ';
					
				}
			});
			sqlEvents.filterOption = "Company";
			angular.forEach($scope.companyCheckbox || [], function(value, key) {
				if($scope.companyCheckbox[key]===true) {
					sqlEvents.topicFilterOption = "one";
					sqlEvents.filterKey = key;
					sqlEvents.filterEvents();
					modalSrvc.isFilter = true;
					modalSrvc.isFilterOption['Company'] = true ;
					//sqlEvents.filterMessage += (sqlEvents.filterKey + ' | ');
					message += sqlEvents.filterKey + ' | ';
				}
			});
			sqlEvents.filterOption = "Topic";
			angular.forEach($scope.topicCheckbox || [], function(value, key) {
				if($scope.topicCheckbox[key]===true) {
					sqlEvents.topicFilterOption = "all";
					sqlEvents.filterKey = key;
					sqlEvents.filterEvents();
					modalSrvc.isFilter = true;
					modalSrvc.isFilterOption['Topic'] = true ;
					//sqlEvents.filterMessage += (sqlEvents.filterKey + ' //');
					message += sqlEvents.filterKey;
					//alert(self.filterMessage);
				}
			});
			sqlEvents.filterMessage = message;
			
			//alert(message);
			$rootScope.$broadcast('reload-data');	
			sqlEvents.lastFilteredData = allDataSrvc.events;
		};
	}]);
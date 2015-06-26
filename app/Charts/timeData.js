angular.module( 'charts.timeData', [
	'events.events'
	])

  .factory('timeData', ['Events', '$scope', '$rootScope', function (Events, $rootScope, $scope) {
	
	var self = [];
	var events = Event.getEvents();
	var timeLabels = ['0'];
	
	$scope.granulation = 0;
	$scope.firstEvent = Event.getEventUTC(events[0]).getTime() || 0;

	self.getAggregateMinuteData = function() {
		angular.forEach(events || [], function (event){

		});
	};



	return self;


}]); 
angular.module( 'charts.barData', [
	'events.events'
	] )



// ----------- EVENTS FACTORY --------------
 .factory('barData', ['Events','$rootScope', function (Events,$rootScope) {

	var self = [];

	self.getData = function() {
		return self;
	};


	self.updateData = function () {
		var topicsCounts = [];
		var topicsObjects = Events.listTopics();

		angular.forEach(topicsObjects || [], function (topic) {
			topicsCounts.push(topic.count);
		});
		self = topicsCounts;
		console.log(topicsCounts);
		$rootScope.$broadcast('graph-updated');
	};


	self.getLabels = function () {
		var labels = [];
		var topicsObjects = Events.listTopics();

		angular.forEach(topicsObjects || [], function (topic) {
			labels.push(topic.name);
		});
	return labels;
	};
	
	return self;


}]); 
// --------


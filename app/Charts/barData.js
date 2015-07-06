angular.module( 'charts.barData', [
	'events.events'
	] )



// ----------- EVENTS FACTORY --------------
 .factory('barData', ['Events','$rootScope', function (Events, $rootScope) {

	var self = [];
	var dataCounts = [];
	var dataLabels = [];

	self.getDataCounts = function () {

	};

	self.getData = function() {
		return self;
	};

	self.updateData = function () {
		var topicsCounts = [];
		var topicsObjects = Events.getTopics();

		angular.forEach(topicsObjects || [], function (topic) {
			topicsCounts.push(topic.count);
		});
		self = topicsCounts;
		//console.log(topicsCounts);
	};


	self.getLabels = function () {
		var labels = [];
		var topicsObjects = Events.getTopics();

		angular.forEach(topicsObjects || [], function (topic) {
			labels.push(topic.name);
		});
	return labels;
	};
	









	return self;


}]); 
// --------


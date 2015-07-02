/* 
	Events:
		meta:
			utc:
			topic:
			agent:
		reactorMeta:
			company:
			userId:
*/

angular.module( 'events.events', [] )
// ----------- EventsMeta FACTORY --------------
	.factory('Events', function () {

		var self = [];
		var currentEvent = {};
		var topics = {};



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




		self.addEvent = function (data) {
			self.push(data);
		};
		self.getEvents = function () {
			return self;
		};
		self.setCurrentEvent = function (data) {
			currentEvent = data;
		};
		self.getCurrentEvent = function () {
			return currentEvent;
		};

		// Meta ================================
		self.getEventMeta = function (event) {
			return event.meta || {};
		};

		// Getting Meta Properties
		self.getDate = function (event) {
			var d = new Date(event.meta.utc);
			return d || "";
		};

			// Time Functions 
			self.getEventsByType = function (type) {
				eventType = [];
				angular.forEach(self || [], function (event) {
					if (getEventTopic(event) === type)
						eventType.push(event);
					return eventType;
				});
			};


		self.getTopic = function (event) {
			var tempStr = event.meta.topic;
			var tempArr = tempStr.split(".");
			return tempArr[0] || "";
		};
		self.getEventAgent = function (meta) {
			return event.meta.agent || "";
		};

		//-------------------------------------
/*
		self.getAllEventTopics = function () { // returns an arrys with all routing keys 
			topics = [];
			angular.forEach(self || [], function (event) {
				//console.log(self);
				var tempStr = event.meta.topic;
				var tempArr = tempStr.split(".");
				topics.push(tempArr[0]);
				});
			return topics;
			};

		self.listTopics = function () { // returns an array with an instance for each routing key
			var topics = self.getAllEventTopics();
			//console.log(routingKeys);
			var topicsObjects = {};

			angular.forEach(topics || [], function (topic) {
				if (topicsObjects[topic]) {
					topicsObjects[topic].count ++;
				}
				else {
					topicsObjects[topic] = {
						name: topic,
						count: 1
					};
				}
			});
			//console.log(topicsObjects);
			return topicsObjects;
		};
*/
		//-------------------------------------

		// reactorMeta =========================
		self.getEventReactorMeta = function (event) {
			return event.reactorMeta || {};
		};
		self.getCompany = function (event) {
			return event.reactorMeta.company || "";
		};
		self.getUserId = function (event) {
		//	return event.reactorMeta.userId;
		};



 	return self;

	});
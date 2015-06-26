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
		self.addEvent = function (data) {
			self.push(data);
		};
		self.getEvents = function () {
			return self;
		};


		// Meta ================================
		self.getEventMeta = function (event) {
			return event.meta || {};
		};

		// Getting Meta Properties
		self.getEventTimeStamp = function (event) {
			return event.meta.utc || "";
		};
			// Time Functions 
			self.getEventUTC = function (event) {
				var date = new Date(event.utc);
				return date;
			};


		self.getEventTopic = function (event) {
			return event.meta.topic || "";
		};
		self.getEventAgent = function (meta) {
			return event.meta.agent || "";
		};

		//-------------------------------------

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
			console.log(topicsObjects);
			return topicsObjects;

		};

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
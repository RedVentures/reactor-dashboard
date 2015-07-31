angular.module( 'events.fields', [] )


// ----------- EVENTS FACTORY --------------
 .factory('Events', function () {





	var self = [];
	var routingKeys = [];



	self.addEvent = function (data) {
		self.push(data);
	};
	self.getEvents = function () {
		return self;
	};

	self.countForIn= function (selected, list, property) {
		var count = 0;
   		angular.forEach(list || [], function(current) {
   			count += (current.property === selected) ? 1 : 0;
   		});
   	return count;
	};






// ------ ROUTING KEYS ------
	self.getRoutingKeys = function () { // returns an arrys with all routing keys 
		routingKeys = [];
		angular.forEach(self || [], function (event) {
			//console.log(self);
			var tempStr = event.routingKey.substring(20);
			var tempArr = tempStr.split(".");
			routingKeys.push(tempArr[0]);
			});
		return routingKeys;
		};

	self.listRoutingKeys = function () { // returns an array with an instance for each routing key
		var routingKeys = self.getRoutingKeys();
		//console.log(routingKeys);
		var routingKeysObject = {};


		angular.forEach(routingKeys || [], function (routKey) {
			if (routingKeysObject[routKey]) {
				routingKeysObject[routKey].count ++;
			}
			else {
				routingKeysObject[routKey] = {
					name: routKey,
					count: 1
				};
			}
		});
		console.log(routingKeysObject);
		return routingKeysObject;

	};


	return self;

});
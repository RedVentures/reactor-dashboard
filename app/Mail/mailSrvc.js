angular.module( 'mail.mailSrvc', [
	'events.events'
	])

  .factory('mailSrvc', ['Events', '$rootScope', 
    function (Events, $rootScope) {
	 
    var self = [];

    self.contactName = function () {
      return contactName;
    }

    self.


    return self;

}]); 
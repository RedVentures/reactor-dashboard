angular.module( 'modals.modalSrvc', [
	])

  .factory('modalSrvc', [ function (modalCtrl) {
	
	var self = {};

	self.agentCheckbox = {};
	self.companyCheckbox = {};
	self.topicCheckbox = {};
	self.isFilterOption =  {'Agent': false, 'Company': false, 'Topic': false};
	self.isFilter = false;

	return self;
}]); 


angular.module('charts.chartsApp', [])
	.controller ('chartController', [ '$scope', function ($scope) {
		
		$scope.template = "bar-graph";

		$scope.chartTemplates =
		[	{name: 'view-all', url: '/templates/Charts/view-all.html'},
			{name: 'bar-graph', url:'/templates/Charts/bar-graph.html'},
			{name: 'pie-chart', url: '/templates/Charts/pie-chart.html'},
			{name: 'line-chart', url: '/templates/Charts/line-chart.html'}
		];

//		$scope.setCurrentTemplate = function () {
//			$scope.chartTemplate = $scope.template.url;
//			console.log($scope.template);
//		};


	}]);



/*
	.config( ['$routeProvider', function ($routeProvider) {
		$routeProvider.
	      when('/bar-graph', {
	        templateUrl: 'templates/Charts/bar-graph.html'
	      }).
	      when('pie-chart', {
	        templateUrl: 'templates/Charts/pie-chart.html'
	      }).
	      otherwise({
	        redirectTo: 'templates/Charts/bar-graph.html'
	      });
	  }]); */


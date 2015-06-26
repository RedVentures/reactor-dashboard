/*
			console.log('mychart', document.getElementById("myChart"));
			var myChart = document.getElementById("myChart").getContext("2d");
			var data = {
				labeles: ["EventsA", "EventsB", "EventsC"],
				datasets: [
					{
						label: "First DataSet",
						fillColor: "rgba(220,220,220,0.5)",
           				strokeColor: "rgba(220,220,220,0.8)",
           				highlightFill: "rgba(220,220,220,0.75)",
           				highlightStroke: "rgba(220,220,220,1)",
           				data: [
	           				selectedEventCount('A'), 
	           				selectedEventCount('B'),
	           				selectedEventCount('C') ]
					}]
			};

			new Chart(myChart).Bar(data);


*/


	var app = angular.module("ReactorChartsApp", ["chart.js"]);
	
	  // Optional configuration
	  app.config(['ChartJsProvider', function (ChartJsProvider) {
		    // Configure all charts
		    ChartJsProvider.setOptions({
		      colours: ['#FF5252', '#FF8A80'],
		      responsive: false
		    });
		    // Configure all line charts
		    ChartJsProvider.setOptions('Line', {
		      datasetFill: false
		    });
	  }]);

	  app.controller("LineCtrl", ['$scope', '$timeout', function ($scope, $timeout) {
		  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
		  $scope.series = ['Series A', 'Series B'];
		  $scope.data = [
		    [65, 59, 80, 81, 56, 55, 40],
		    [28, 48, 40, 19, 86, 27, 90]
		  ];
		  $scope.onClick = function (points, evt) {
		    console.log(points, evt);
		  };

		  // Simulate async data update
		  $timeout(function () {
		    $scope.data = [
		      [28, 48, 40, 19, 86, 27, 90],
		      [65, 59, 80, 81, 56, 55, 40]
		    ];
		  }, 3000);

	  }]);






angular.module( 'charts.pieChart', [
	'charts.barData'

	])



// CHARTS CODE

	  // Optional configuration
	  .config(['ChartJsProvider', 
	  	function (ChartJsProvider) {

		    // Configure all charts
		    ChartJsProvider.setOptions({
		      colours: ['#FF5252'],
		      responsive: true
		    });
		    // Configure all line charts
		    /*ChartJsProvider.setOptions('Line', {
		      datasetFill: false
		    }); */
	  }])


	  .controller("PieCtrl", ['$scope', '$timeout', 'barData', 
	  	function ($scope, $timeout, barData) {

		  $scope.labels = barData.getLabels();
		  console.log($scope.labels);
		  //$scope.series = ['Series A'];
		  $scope.data = barData.getData();

		  $scope.$on('graph-updated', function() {
		  	$scope.data = barData.getData();
		  	$scope.labels = barData.getLabels();
		  });



		  $scope.onClick = function (points, evt) {
		    console.log(points, evt);
		  };

		  // Simulate sync data update
		  // $scope.updateData = function () {
		  // 	barData.updateData();
		  // 	$scope.updateGraph();	
		  // 	$scope.data = [ barData.getData() ];
		  // 	console.log('calling update');
		  // };


	  }]);
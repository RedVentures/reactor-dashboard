angular.module( 'charts.pieChart2', [
	'charts.pieChart2Data'
	])

	.controller("PieCtrl2", ['$scope', '$timeout', 'pieChart2Data', function ($scope, $timeout, pieChart2Data) {

	$scope.pieChart = pieChart2Data.getPieChart();
	$scope.pieChart.invalidateSize();
    $scope.pieChart.write("piechartdiv");

	$scope.barChart = pieChart2Data.getBarChart();
	$scope.barChart.invalidateSize();
    $scope.barChart.write("barchartdiv");
		


		$scope.$on('graph-updated', function() {
		  	pieChart2Data.updateData();
		  	$scope.pieChart.dataProvider = pieChart2Data.getData();
		  	$scope.barChart.dataProvider = pieChart2Data.getData();
		  	$scope.pieChart.validateData();
		  	$scope.barChart.validateData();
		  	$scope.pieChart.invalidateSize();
		  	$scope.barChart.invalidateSize();
		  	//pieChart2Data.updateChart();
		  	//pieChart2Data.getChart();
		  });

	}]); 




  
// THIS CODE IS NOT BEING USED NOW
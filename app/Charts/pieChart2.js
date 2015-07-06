angular.module( 'charts.pieChart2', [
	'charts.pieChart2Data'
	])

	.controller("PieCtrl2", ['$scope', '$timeout', 'pieChart2Data', function ($scope, $timeout, pieChart2Data) {

	var pieDataArr = pieChart2Data.getData();

	chart = new AmCharts.makeChart( "chartdiv", {
        type: "pie",
        theme: "light",
	    "startDuration": 0,
	  	"addClassNames": true,
	  	"legend":{
		  "position":"right",
		  "marginRight":100,
		  "autoMargins":false
	  	},
	  	//"innerRadius": "30%",
	  	"defs": {
	    "filter": [{
	      "id": "shadow",
	      "width": "200%",
	      "height": "200%",
	      "feOffset": {
	        "result": "offOut",
	        "in": "SourceAlpha",
	        "dx": 0,
	        "dy": 0
	      },
	      "feGaussianBlur": {
	        "result": "blurOut",
	        "in": "offOut",
	        "stdDeviation": 5
	      },
	      "feBlend": {
	        "in": "SourceGraphic",
	        "in2": "blurOut",
	        "mode": "normal"
	      } 
	  	}] },
	  	"autoMargins": false,
        dataProvider: pieDataArr,
        valueField: "value",
        titleField: "label",
        export: {
            "enabled": true
          },
        "autoMargins": false
    });
    //chart.validateData();
    //chart.animateAgain();
	
		$scope.$on('graph-updated', function() {
		  	pieChart2Data.updateData();
		  	chart.dataProvider = pieChart2Data.getData();
		  	chart.validateData();
		  	//pieChart2Data.updateChart();
		  	//pieChart2Data.getChart();
		  });
	}]); 
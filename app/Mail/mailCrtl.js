angular.module('mail.mailCrtl', [
	'events.events',
	'charts.lineData',
	'charts.pieChart2Data'
	])
	.controller ('mailCrtl', [ '$scope','$rootScope', '$timeout', '$http', '$mdToast','mailSrvc',

	function ($scope, $rootScope, $timeout, $http, mdToast, mailSrvc ) {
		
		$scope.contactName = mailSrvc.getContactName();
		$scope.email = mailSrvc.getEmail();
		$scope.message = mailSrvc.getMessage();


		$scope.toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        $scope.getToastPosition = function () {
            return Object.keys($scope.toastPosition)
                .filter(function (pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };

		this.sendMail = function () {

			var data = ({
				contactName: mailSrvc.getContactName(),
                email: mailSrvc.getEmail(),
                message: mailSrvc.getMessage()
			});


			$http.post('/contact-form', data).
				success( function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
					$mdToast.show( 
						$mdToast.simple ()
							.content('Message was sent!')
							.position($scope.getToastPosition())
							.hideDelay(5000)
					);
				}). 
				error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

		};






	}]);
var consentControllers = angular.module("consentControllers", []);

consentControllers.controller("ShowPostLoginConsentController", ["$scope", "$rootScope", "$http", "$location" , "API_ROOT_URL", "ApplicantService", "AlertService","LoginService","AuthService", function($scope, $rootScope, $http, $location , API_ROOT_URL, ApplicantService, AlertService,LoginService,AuthService) {
	
		$scope.postLoginConsent = $rootScope.cache.postLoginConsent;
		
		$scope.submitConsent = function (){
			ApplicantService.agreeConsent($rootScope.loggedInUser.nin).success(function(status) {
				$rootScope.loggedInUser.hasAgreedToConsent = true;
				$location.path("/start");
			}).error(function() {
				AlertService.error($rootScope);
			});
			
		};
		
		$scope.cancelConsent = function() {
				LoginService.logout();
				AuthService.nullifyUser();
				$rootScope.loggedInUser = null;
				$location.path("/home");
		};
	
}]);


var profileControllers = angular.module("profileControllers", []);

profileControllers.controller("ShowProfileController", ["$scope", "$rootScope", "$http", "$location" , "API_ROOT_URL" ,"AlertService", "LoginService", "AuthService" , "ApplicantService", function($scope, $rootScope, $http, $location, API_ROOT_URL, AlertService, LoginService, AuthService , ApplicantService) {
	
	$scope.lastLoginTimestamp = $rootScope.loggedInUser.lastLoginTimestamp;
	ApplicantService.getUserProfile().success(function(applicationStatus) {
		
		$scope.applicationStatus = applicationStatus;
	
	}).error(function(){

	});
	bindeZoomInAndOut();
}]);

profileControllers.controller("SuspendEligibilityController", ["$scope", "$rootScope", "$http", "$location" , "API_ROOT_URL" ,"AlertService", function($scope, $rootScope, $http, $location, API_ROOT_URL, AlertService) {
	
	$scope.activeEligibility = function (){
		$http.get(API_ROOT_URL + "/profile/active-account").success(function(status) {
			if (status == 1) {
				$rootScope.loggedInUser.registrationStatus = "ACTIVE";
				$location.path("show-profile");
			}
		}).error(function() {
			AlertService.error($rootScope);
		});
	};
	
	
	$scope.suspendEligibility = function() {
		$http.get(API_ROOT_URL + "/profile/suspend-account").success(function(status) {
			if (status == 1) {
				$rootScope.loggedInUser.registrationStatus = "SUSPENDED_FROM_ELIGIBILITY";
				$location.path("show-profile");
			}
		}).error(function() {
			AlertService.error($rootScope);
		});
	};
}]);

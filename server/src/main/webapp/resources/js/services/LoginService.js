angular.module("myApp").factory("LoginService", ["$rootScope","$http", "$q", "AuthService", "ROOT_URL", "API_ROOT_URL","$window", function($rootScope,$http, $q, AuthService, ROOT_URL, API_ROOT_URL,$window) {

	return {
		login: function(credentials) {
			return $http.post(ROOT_URL + "/login", credentials);
		},
		submitOneTimePassword: function(oneTimePasswordForm) {
			return $http.post(ROOT_URL + "/login/otp", oneTimePasswordForm);
		},
		cancelOneTimePassword: function() {
			return $http.post(ROOT_URL + "/login/cancel-otp");
		},
		logout: function() {
			return $http.post(ROOT_URL + "/j_spring_security_logout");
		}
	};
}]);
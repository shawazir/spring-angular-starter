angular.module("myApp").factory("NotificationService", ["$rootScope", "$http", "AuthService", "ROOT_URL", "API_ROOT_URL", function($rootScope, $http, AuthService, ROOT_URL, API_ROOT_URL) {
	
	return {
		getAllNotifications: function() {
			return $http.get(API_ROOT_URL + "/notification");
		},
		updateNotification: function(notificationId) {
			return $http.get(API_ROOT_URL + "/notification/"+notificationId);
		}
	};
}]);
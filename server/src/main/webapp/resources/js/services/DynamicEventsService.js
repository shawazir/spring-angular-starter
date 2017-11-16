angular.module("myApp").factory("DynamicEventsService", ["$rootScope", "$location", "$http", "AlertService", "API_ROOT_URL",function($rootScope, $location, $http, AlertService, API_ROOT_URL) {
	return {
		init: function() {
			$rootScope.$on("P200-T4-Save", function(event, data) {	
			});
		}
	};
}]);
angular.module("myApp").factory("HomeService",[ "$http", "API_ROOT_URL", function($http, API_ROOT_URL) {
			return {
				getAllActiveHomeContent : function() {
					return $http.get(API_ROOT_URL + "/home-page-content");
				}
			};
		}]);
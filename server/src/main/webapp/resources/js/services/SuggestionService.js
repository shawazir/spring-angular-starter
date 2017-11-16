angular.module("myApp").factory("SuggestionService", ["$http", "API_ROOT_URL", function($http, API_ROOT_URL) {
	
	return {
		getAllQuestions: function() {
			return $http.get(API_ROOT_URL + "/suggestion/requests-info");
		},
		save: function(data) {
			return $http.post(API_ROOT_URL + "/suggestion/create",data);
		}
	};
}]);
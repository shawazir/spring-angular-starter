angular.module("myApp").factory("FaqService", ["$http", "API_ROOT_URL", function($http, API_ROOT_URL) {
	return {
		getFaqCategories: function() {
			return $http.get(API_ROOT_URL + "/cache/faqs/categories");
		},
		getFaqs: function(notificationId) {
			return $http.get(API_ROOT_URL + "/cache/faqs");
		}
	};
}]);
angular.module("myApp").factory("CalculatorService", ["$http", "API_ROOT_URL", function($http, API_ROOT_URL) {
	return {
		getPaymentAmount: function(formInput) {
			return $http.post(API_ROOT_URL + "/calculator/get-payment-amount", formInput);
		}
	};
}]);
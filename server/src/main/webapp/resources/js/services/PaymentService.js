angular.module("myApp").factory("PaymentService", ["$http", "API_ROOT_URL", function($http, API_ROOT_URL) {
	return {
		getCurrentPaymentInfo: function() {
			return $http.get(API_ROOT_URL + "/payment/current-payment");
		},
		getPaymentHistory: function() {
			return $http.get(API_ROOT_URL + "/payment/payment-history");
		},
		getPaymentSummary: function() {
			return $http.get(API_ROOT_URL + "/payment/payment-summary");
		},
		getDependentsInEligibilityInfo: function(dependentNIN) {
			return $http.get(API_ROOT_URL + "/eligibility/dependents-ineligibility-info/"+dependentNIN);
		},
		updateReapplyStatus: function() {
			return $http.post(API_ROOT_URL + "/eligibility/update-reapply-state");
		},
		resumePayment: function() {
			return $http.post(API_ROOT_URL + "/payment/resume-payment");
		},
		checkIfRejectedPaymentExist: function() {
			return $http.post(API_ROOT_URL + "/payment/check-if-rejected-payment-exist");
		}
	};
}]);
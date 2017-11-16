angular.module("myApp").factory("EligibilityService", ["$http", "API_ROOT_URL", function($http, API_ROOT_URL) {
	return {
		getEligibilityConditions: function() {
			return $http.get(API_ROOT_URL + "/eligibility/rules");
		},
		getEligibilityStatus: function() {
			return $http.get(API_ROOT_URL + "/eligibility/current-eligibility");
		},
		getApplicantIneligibilityReasons: function() {
			return $http.get(API_ROOT_URL + "/eligibility/ineligibility-reaons");
		},
		getDependentsEligibilityInfo: function() {
			return $http.get(API_ROOT_URL + "/eligibility/dependents-eligibility-info");
		},
		getDependentsInEligibilityInfo: function(dependentNIN) {
			return $http.get(API_ROOT_URL + "/eligibility/dependents-ineligibility-info/"+dependentNIN);
		},
		getRequiredDocsForIneligibilityCode: function(ineligibilityCode) {
			return $http.get(API_ROOT_URL + "/applicant-appeal/get-required-docs-for-ineligibility-code/"+ineligibilityCode);
		},
		raiseAppeal: function(appealInfo) {
			return $http.post(API_ROOT_URL + "/applicant-appeal/raise-appeal",appealInfo);
		},
		retrieveActiveAppeals: function() {
			return $http.get(API_ROOT_URL + "/applicant-appeal/retrieve-active-appeals");
		},
		
		
		
		
		
		getEligibilityStatusHistory: function() {
			return $http.get(API_ROOT_URL + "/eligibility/applicant-eligi-history");
		},
		getApplicantIneligibilityReasonsHistory: function(cycleId) {
			return $http.get(API_ROOT_URL + "/eligibility/applicant-Ineligi-history-message/"+cycleId);
		},
		getDependentsEligibilityInfoHistory: function(cycleId) {
			return $http.get(API_ROOT_URL + "/eligibility/dependents-eligi-history/"+cycleId);
		},
		getDependentsInEligibilityMessageHistory: function(cycleId,dependentNIN) {
			return $http.get(API_ROOT_URL + "/eligibility/dependents-eligi-history-messages/"+cycleId+"/"+dependentNIN);
		},
		
		
		updateReapplyStatus: function() {
			return $http.post(API_ROOT_URL + "/eligibility/update-reapply-state");
		}
	};
}]);
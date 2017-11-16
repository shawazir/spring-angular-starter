angular.module("myApp").factory("ApplicationService", ["$http", "API_ROOT_URL", function($http, API_ROOT_URL) {
	return {
		getUploadedFiles: function(){
			return $http.get(API_ROOT_URL + "/document");
		},
		retrieveTab4Data : function(){
			return $http.get(API_ROOT_URL + "/applicant-income/load");
		},
		deleteFiles: function(deletedFiles){
			return $http.post(API_ROOT_URL + "/document/delete/",deletedFiles);
		},
		resumePayment: function(){
			return $http.post(API_ROOT_URL + "/payment/resume-payment");
		},
		loadGeneralInfo: function(){
			return $http.get(API_ROOT_URL + "/applicant/load-general-info");
		},
		saveGeneralInfo: function(data){
			return $http.post(API_ROOT_URL + "/applicant/save-general-info" , data);
		},
		loadDependentAndHOH: function(data){
			return $http.get(API_ROOT_URL + "/applicant/load-dependents");
		},
		completeWithoutDocuments: function(data){
			return $http.post(API_ROOT_URL + "/document/complete-without-documents");
		},
		isRequiredDocument: function(){
			return $http.get(API_ROOT_URL + "/document/is-required-document");
		},
		viewAppeals: function(pageNumber){
			return $http.get(API_ROOT_URL + "/applicant-appeal/view-appeals/page/" + pageNumber);
		},
		raiseAppeal: function(){
			return $http.post(API_ROOT_URL + "/applicant-appeal/raise-appeal");
		},
		reapply: function(){
			return $http.post(API_ROOT_URL + "/eligibility/update-reapply-state");
		},
		checkReapplyState: function(){
			return $http.get(API_ROOT_URL + "/eligibility/check-reapply-state");
		}
		
		
	};
}]);
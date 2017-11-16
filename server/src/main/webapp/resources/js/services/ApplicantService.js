angular.module("myApp").factory("ApplicantService", ["$http", "API_ROOT_URL", function($http, API_ROOT_URL) {
	return {
		validateEnteredCaptchaText: function(enteredCaptchaText) {
			return $http.get(API_ROOT_URL + "/captcha-controller/check-captcha/" + enteredCaptchaText);
		},
		registerApplicant: function(registrationData) {
			return $http.post(API_ROOT_URL + "/applicant/register-applicant", registrationData);
		},
		resetUserPassword: function(resetPassForm) {
			return $http.post(API_ROOT_URL + "/applicant/reset-password" , resetPassForm);
		},
		changeUserPassword: function(user) {
			return $http.post(API_ROOT_URL + "/applicant/change-password/", user);
		},
		agreeConsent: function(nin) {
			return $http.post(API_ROOT_URL + "/applicant/agree-consent/", nin);
		},		
		changeMobileNumber: function(form) {
			return $http.post(API_ROOT_URL + "/applicant/update-mobile-number/", form);
		},
		tokenVerficationMobileNumber: function(token) {
			return $http.post(API_ROOT_URL + "/applicant/verify-updated-mobile-number/",token);
		},
		cancelTokenVerficationMobileNumber: function() {
			return $http.get(API_ROOT_URL + "/applicant/cancel-verify-updated-mobile-number/");
		},
		getBenefits: function() {
			return $http.get(API_ROOT_URL + "/applicant/get-benefits/");
		},
		saveBenefits: function(benefitsIds) {
			return $http.post(API_ROOT_URL + "/applicant/save-benefits/",benefitsIds);
		},
		getUserProfile :function(){
			return $http.get(API_ROOT_URL + "/profile");
		} ,
		getApplicationId :function(){
			return $http.get(API_ROOT_URL + "/applicant/get-applicant-application");
		}
	};
}]);
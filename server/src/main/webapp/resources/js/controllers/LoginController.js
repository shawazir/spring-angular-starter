﻿﻿var loginControllers = angular.module("loginControllers", []);

loginControllers.controller("LoginController", ["$scope", "$rootScope", "$location", "LoginService", "AuthService", "AlertService", "API_ROOT_URL", function($scope, $rootScope, $location, LoginService, AuthService, AlertService,API_ROOT_URL) {
	// Credentials
	$scope.credentials = {username: "", password: ""};

	// Refreshes the captcha
	$scope.refreshCaptcha = function() {
		$scope.captchaImage = API_ROOT_URL + "/captcha-controller/captcha-image?" + new Date().getTime();
	}

	$scope.refreshCaptcha();

	// Submit form function
	$scope.submitForm = function(credentials) {
		$scope.actionInProgress = true;
		LoginService.login(credentials).success(function(data) {
			$scope.actionInProgress = false;

			var loggedInUser = data.value;
			AuthService.setUser(loggedInUser);

			redirectAfterSuccessfulLogin(loggedInUser, $rootScope, $location);
		}).error(function(data) {
			$scope.actionInProgress = false;

			$scope.refreshCaptcha();

			if (data.code === 1) { // Invalid captcha
				AlertService.error($rootScope, "الرجاء التأكد من صحة الرمز");
			} else if (data.code >= 2 && data.code <=11) { // Invalid credentials
				AlertService.error($rootScope, "تسجيل دخول خاطئ، الرجاء التحقق من اسم المستخدم وكلمة المرور");
			} else if(data.code === 12){ 
				AlertService.error($rootScope, "الرجاء التواصل مع خدمة العملاء 19912 لتغيير رقم الجوال");
			} else {
				AlertService.error($rootScope);
			}
		});
	};
}]);

loginControllers.controller("OneTimePasswordController", ["$scope", "$rootScope", "$location", "LoginService", "AuthService", "AlertService", function($scope, $rootScope, $location, LoginService, AuthService, AlertService) {
	$scope.oneTimePasswordForm = new Object();
	$scope.oneTimePasswordForm.oneTimePassword = null;

	$scope.submitForm = function(oneTimePasswordForm) {
		$scope.actionInProgress = true;
		LoginService.submitOneTimePassword(oneTimePasswordForm).success(function(data) {
			$scope.actionInProgress = false;

			var loggedInUser = data.value;
			AuthService.setUser(loggedInUser);

			redirectAfterSuccessfulLogin(loggedInUser, $rootScope, $location);
		}).error(function(data) {
			$scope.actionInProgress = false;

			if (data.code === 9) { // Invalid one-time-password
				AlertService.error($rootScope, "الرجاء إدخال كلمة المرور المرسلة بالشكل الصحيح");
			} else if (data.code === 10) { // No one-time-password in place
				AuthService.nullifyUser();
				$location.path("/login");
			} else if (data.code === 11) { // One-time-password timeout
				AuthService.nullifyUser();
				AlertService.roamingAlert("danger", "إنقضى الوقت المتاح لإدخال كلمة المرور المؤقتة");
				$location.path("/login");
			} else {
				AlertService.error($rootScope);
			}
		});
	}

	$scope.cancelOneTimePassword = function() {
		$scope.actionInProgress = true;
		LoginService.cancelOneTimePassword().success(function(data) {
			$scope.actionInProgress = false;

			AuthService.nullifyUser();
			$location.path("/login");
		}).error(function(data) {
			$scope.actionInProgress = false;

			if (data.code === 10) { // No one-time-password in place
				AuthService.nullifyUser();
				$location.path("/login");
			} else {
				AuthService.nullifyUser();
				$location.path("/login");
			}
		});
	}
}]);

function redirectAfterSuccessfulLogin(loggedInUser, $rootScope, $location) {
	if (loggedInUser.otpActive === true) {
		$location.path("/one-time-password");
	} else if ($rootScope.loggedInUser.mandatoryNotificationCount > 0) {
		$location.path("/notifications");
	} else {
		$location.path("/start");
	}
}

loginControllers.controller("LogoutController", ["$rootScope", "LoginService", "AuthService", function($rootScope, LoginService, AuthService) {
	LoginService.logout();
	alertDynamicPagesServiceOfLogout();
	AuthService.nullifyUser();
}]);

function alertDynamicPagesServiceOfLogout() {
	var hasDynamicPagesService = angular.element(document.body).injector().has('DynamicPagesService');
	if (hasDynamicPagesService) {
		var DynamicPagesService = angular.element(document.body).injector().get('DynamicPagesService');
		DynamicPagesService.doPreLogout();
	}
}

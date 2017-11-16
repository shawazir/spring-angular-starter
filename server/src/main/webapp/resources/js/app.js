myApp.constant("ROOT_URL", "/registration-subsidies-portal");
myApp.constant("API_ROOT_URL", "/registration-subsidies-portal");
myApp.constant("REVIEW_TAB_NO", 1000000);


myApp.config([ "$routeProvider", "$httpProvider", function($routeProvider, $httpProvider) {
	
	//csrfProvider.config({url:API_ROOT_URL});
	

	$routeProvider.when("/home", {
		templateUrl : "resources/html/home/home.html",
		controller : "HomeController",
		title : "الصفحة الرئيسية"
	}).when("/about-program", {
		templateUrl : "resources/html/home/about-program.html",
		controller : "AboutProgramController",
		title : "عن البرنامج"
	}).when("/start", {
		templateUrl : "resources/html/home/start.html",
		controller : "StartController",
		title : "الصفحة الرئيسية"
	}).when("/login", {
		templateUrl : "resources/html/login/login.html",
		controller : "LoginController",
		title : "تسجيل الدخول"
	}).when("/one-time-password", {
		templateUrl : "resources/html/login/one-time-password.html",
		controller : "OneTimePasswordController",
		title : "كلمة المرور المؤقتة"
	}).when("/logout", {
		templateUrl : "resources/html/login/logout.html",
		controller : "LogoutController",
		title : "تسجيل الخروج"
	}).when("/suspend", {
		templateUrl : "resources/html/login/suspended.html",
		controller : "LogoutController",
		title : "تعليق الحساب"
	}).when("/reset-password", {
		templateUrl : "resources/html/login/password-reset.html",
		controller : "ResetPasswordController",
		title : "إستعادة كلمة المرور"
	}).when("/show-profile", {
		templateUrl : "resources/html/profile/show-profile.html",
		controller : "ShowProfileController",
		title : "حسابي"
	}).when("/suspend-eligibility", {
		templateUrl : "resources/html/profile/suspend-eligibility.html",
		controller : "SuspendEligibilityController",
		title : "تعليق الحساب"
	}).when("/faq", {
		templateUrl : "resources/html/faq/list-faqs.html",
		controller : "ListFaqsController",
		title : "الأسئلة الشائعة"
	}).when("/contact-us", {
		templateUrl : "resources/html/suggestions/contact-us.html",
		controller : "CreateSuggestionController",
		title : "إتصل بنا"
	}).when("/register", {
		templateUrl : "resources/html/dynamic-page/100",
		controller : "RegisterApplicantController",
		title : "تسجيل مستخدم جديد"
	}).when("/consent", {
		templateUrl : "resources/html/consent/show-consent.html",
		controller : "ShowPostLoginConsentController",
		title : "إقرار"
	}).when("/alert/view", {
		templateUrl : "resources/html/alert/view-alert.html",
		controller : "ViewAlertController",
		title : "ViewAlert"
	}).when("/alert/create", {
		templateUrl : "resources/html/alert/create-alert.html",
		controller : "CreateAlertController",
		title : "CreateAlert"
	}).when("/eligibility-rules", {
		templateUrl : "resources/html/eligibility/eligibility-rules.html",
		controller : "EligibilityController",
		title : "شروط الإستحقاق"
	}).when("/change-password", {
		templateUrl : "resources/html/applicant/change-pass.html",
		controller : "ChangePasswordController",
		title : "تغيير كلمة المرور"
	}).when("/change-mobile-number", {
		templateUrl : "resources/html/applicant/change-mobile-number.html",
		controller : "ChangeMobileNumberController",
		title : "تغيير رقم الجوال"
	}).when("/usage-conditions", {
		templateUrl : "cache/static-pages/2",
		controller : "staticPageController",
		title : "شروط الإستخدام"
	}).when("/privacy-policy", {
		templateUrl : "cache/static-pages/1",
		controller : "staticPageController",
		title : "سياسة الخصوصية"
	}).when("/notifications", {
		templateUrl : "resources/html/notifications-inbox/notifications.html",
		controller : "notificationController",
		title : "صندوق الرسائل"
	}).when("/news", {
		templateUrl : "resources/html/home/all-news.html",
		controller : "HomeController",
		title : "كل الأخبار"
	}).when("/eligibility", {
		templateUrl : "resources/html/eligibility/eligibility-status.html",
		controller : "EligibilityPageController",
		title : "حالة الإستحقاق"
	}).when("/eligibility-history", {
		templateUrl : "resources/html/eligibility/eligibility-history.html",
		controller : "EligibilityHistoryController",
		title : "حالة الإستحقاق"
	}).when("/payment", {
		templateUrl : "resources/html/payment/payment.html",
		controller : "PaymentController",
		title : "حالة الدفعات"
	}).when("/view-appeals/page/:pageNumber", {
		templateUrl: "resources/html/appeal/view-appeals.html",
		controller: "AppealController",
		title: "الإعتراضات"
	}).when("/payment-summary", {
		templateUrl : "resources/html/payment/payment-summary.html",
		controller : "PaymentSummaryController",
		title : "ملخص الدفعات"
	}).when("/calculate-payment", {
		templateUrl : "resources/html/calculator/calculate-payment.html",
		controller : "GetPaymentAmountController",
		title : "الحاسبة"
	}).otherwise({
		redirectTo : "/home"
	});
	
	//$httpProvider.defaults.cache = false;
	//$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
	$httpProvider.defaults.headers.common["Cache-Control"] = "no-cache, no-store, must-revalidate, private, pre-check=0, post-check=0";
	$httpProvider.defaults.headers.common["Pragma"] = "no-cache";
	$httpProvider.defaults.headers.common["Expires"] = "0";
	$httpProvider.defaults.headers.common["X-Content-Type-Options"] = "nosniff";
	$httpProvider.defaults.headers.common["X-XSS-Protection"] = "1";
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	

} ]).run(
		[
				"$rootScope",
				"$location",
				"$route",
				"$http",
				"AuthService",
				"API_ROOT_URL",
				"GenCacheService",
				"TimeoutService",
				"ModalService",
				"DynamicEventsService",
				"EligibilityService",
				function($rootScope, $location, $route, $http, AuthService, API_ROOT_URL, GenCacheService,
						TimeoutService, ModalService, DynamicEventsService,EligibilityService) {
					setLoggedInUser($rootScope, $location, $route, $http, AuthService, API_ROOT_URL, TimeoutService);
					copyCacheObjectRootScope($rootScope, GenCacheService);
					setupAuthenticationBehaviour($rootScope, $location, $route, $http, AuthService, API_ROOT_URL,
							TimeoutService);
					setTitlesOfPages($rootScope);
					setActiveClass($rootScope, $location);
					manageRoamingAlerts($rootScope, $location);
					checkIfPasswordNeedToBeChanged($rootScope, $location, $route, $http, AuthService);
					checkIfHeNeedDocumentModel($rootScope, $location, ModalService , $http , API_ROOT_URL);
					getEligibilityInfo($rootScope, $location, ModalService ,EligibilityService, $http , API_ROOT_URL);
					DynamicEventsService.init();
				} ]);

/**
 * Copies the cache object from the CacheService to $rootScope.
 * 
 * @param $rootScope
 * @param GenCacheService
 */
function copyCacheObjectRootScope($rootScope, GenCacheService) {
	$rootScope.cache = GenCacheService.getCache();
}

/**
 * Sets the loggedInUser info if it's undefined.
 * 
 * @param AuthService
 */
function setLoggedInUser($rootScope, $location, $route, $http, AuthService, API_ROOT_URL, TimeoutService) {
	if (AuthService.getUser() === undefined) {
		$http.get(API_ROOT_URL + "/logged-in-user").success(function(data) {
			AuthService.setUser(data);
			if (AuthService.getUser().otpActive === false) {
				TimeoutService.buildTimeOut();
			}
			redirectToProperRoute($location, AuthService);
		}).error(function() {
			AuthService.nullifyUser();
			redirectToProperRoute($location, AuthService);
		});
	} else {
		if (AuthService.getUser() !== null && AuthService.getUser().otpActive === false) {
			$rootScope.afterOneDay = isAfterOneDay($rootScope.loggedInUser.accountSuspensionTimestamp);
			if ($location.path() !== "/logout") {
				TimeoutService.restartTimeout(true);
			}
		} else {
			TimeoutService.stopTimeout();
		}
		redirectToProperRoute($location, AuthService);
	}
}

/**
 * Setup the authentication behavior.
 * 
 * @param $rootScope
 * @param $location
 * @param $route
 * @param $http
 * @param AuthService
 * @param API_ROOT_URL
 */
function setupAuthenticationBehaviour($rootScope, $location, $route, $http, AuthService, API_ROOT_URL, TimeoutService) {
	$rootScope.$on("$routeChangeStart", function(event, next, current) {
		setLoggedInUser($rootScope, $location, $route, $http, AuthService, API_ROOT_URL, TimeoutService);
	});
}

/**
 * Redirects the user to the proper page at the start of his AngularJS session.
 * 
 * @param $location
 * @param AuthService
 */
function redirectToProperRoute($location, AuthService) {
	var anonymousPaths = ["", "/login", "/one-time-password", "/logout", "/suspend", "/home", "/reset-password", "/register", "/faq",
			"/usage-conditions", "/privacy-policy", "/about-program", "/eligibility-rules", "/news"];

	var anonymousOnlyPaths = ["/login", "/one-time-password", "/reset-password", "/register"];

	if (AuthService.getUser() === null) { // User is not logged in and not required to enter the one-time-password
		if ($location.path() === "/one-time-password") { // One time password URL
			$location.path("/login");
		} else if ($location.path() === "/login") { // Login URL
			// Do nothing
		} else if ($location.path() === "/logout") { // Logout URL
			$location.path("/");
		} else if (!anonymousPaths.contains($location.path())) { // URL which needs authentication
			$location.path("/login");
		}
	} else if (AuthService.getUser().otpActive === true) { // User is required to enter the one-time-password
		if ($location.path() === "/one-time-password") { // One time password URL
			// Do nothing
		} else {
			AuthService.nullifyUser();
		}
	} else if (AuthService.getUser().otpActive === false) { // User is logged in
		if ($location.path() === "/one-time-password") { // One time password URL
			$location.path("/start");
		} else if ($location.path() === "/login") { // Login URL
			$location.path("/start");
		} else if ($location.path() === "/logout") { // Logout URL
			// Do nothing
		} else if (anonymousOnlyPaths.contains($location.path())) { // URL which is not allowed for authenticated users
			$location.path("/start");
		}
	}
}

/**
 * Sets the titles of pages.
 * 
 * @param $rootScope
 */
function setTitlesOfPages($rootScope) {
	$rootScope.$on("$routeChangeSuccess", function(event, current, previous) {
		if (current.$$route !== undefined) {
			$rootScope.title = current.$$route.title;
		}
	});
}
/**
 * Sets the active class to main menu of index page.
 * 
 * @param $rootScope
 * @param $location
 */
function setActiveClass($rootScope, $location) {
	$rootScope.$on("$routeChangeSuccess", function() {
		$rootScope.isActive = function(viewLocation) {
			var splitedPath = $location.path().split("/");
			var fristOfPath = "/" + splitedPath[1];
			return viewLocation === fristOfPath;
		};
	});
}

/**
 * Manages roaming alerts.
 * 
 * @param $rootScope
 */
function manageRoamingAlerts($rootScope) {
	$rootScope.$on("$routeChangeStart", function(event, next, current) {
		if ($rootScope.alerts) {
			// Deletes alerts with life spans of 0
			for (var i = $rootScope.alerts.length - 1; i >= 0; i--) {
				if ($rootScope.alerts[i].lifespan === 0) {
					$rootScope.alerts.splice(i, 1);
				}
			}
			// Decrements the life spans of the rest of the alerts
			for (var i = 0; i < $rootScope.alerts.length; i++) {
				$rootScope.alerts[i].lifespan = $rootScope.alerts[i].lifespan - 1;
			}
		}
	});
}

/**
 * checks whether the user needs to change temporary password after first login.
 * 
 * @param $rootScope
 */
function checkIfPasswordNeedToBeChanged($rootScope, $location, $route, $http, AuthService, API_ROOT_URL) {
	$rootScope.$on("$routeChangeSuccess", function(event, current, previous) {
		var skipChecking = !$rootScope.loggedInUser || $location.path() === "/logout";
		if (!skipChecking) {
			if ($rootScope.loggedInUser.needsPasswordReset === true) {
				$location.path("/change-password");
			}
		}
	});
}

/**
 * checks whether the user needs to show document pop-up after login.
 * 
 * @param $rootScope
 */
function checkIfHeNeedDocumentModel($rootScope, $location , ModalService , $http , API_ROOT_URL) {
	$rootScope.$on("$routeChangeSuccess", function(event, current, previous) {
		var doChecking = $rootScope.loggedInUser != undefined && $rootScope.loggedInUser.wizardProgressInfo.getLastSavedTabNo(200) >= 200 && $location.path() === "/start" && (previous != undefined && (previous.$$route.originalPath === "/login" || previous.$$route.originalPath === "/one-time-password"));
		if (doChecking) {
			$http.get(API_ROOT_URL + "/document/is-required-document").success(function(response) {
			if (response.value === 2) {
				modelConfig = {
					title : "تنبيه!",
					message : "يرجى رفع المستندات المطلوبة من خلال أيقونة إضافة المرفقات لإتمام عملية رفع الطلب",
					rejectButtonLable : "إغلاق التنبيه",
					acceptButtonLable : "إذهب إلى صفحة المرفقات",
					redirectPathOnSuccess : "/application/7"
			};
				ModalService.buildModel(modelConfig);
			}
			});
		}
	});
}


/**
**/
function getEligibilityInfo($rootScope, $location , ModalService ,EligibilityService, $http , API_ROOT_URL){
	
	$rootScope.$on("$routeChangeSuccess", function(event, current, previous) {
		
		if($rootScope.loggedInUser == undefined){
			return;
		}
		
		if($rootScope.applicantEligibilityInfo == undefined){
			EligibilityService.getEligibilityStatus().success(function(result) {
				$rootScope.applicantEligibilityInfo = result.value;
//				$scope.actionInProgress = false;
				
			}).error(function(result) {
				AlertService.error($rootScope);
			});
			
		}
		
		if($rootScope.applicantDependentsEligibilityInfo == undefined){
			
			EligibilityService.getDependentsEligibilityInfo().success(function(result) {
				$rootScope.applicantDependentsEligibilityInfo = result.value;
				$scope.actionInProgress = false;
				
			}).error(function(result) {
				AlertService.error($rootScope);
			});
			
		}
	});
}
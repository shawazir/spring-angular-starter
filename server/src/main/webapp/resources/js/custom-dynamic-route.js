angular.module("myApp").config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/application/1", {
		templateUrl : "resources/html/application/general-info.html",
		controller : "GeneralInfoTabController",
		title : "تعبئة/إستكمال الطلب"
	}).when("/application/3", {
		templateUrl : "resources/html/application/dependents-and-income-tab.html",
		controller : "DependentsAndIncomeTabController",
		title : "تعبئة/إستكمال الطلب"
	}).when("/application/4", {
		templateUrl : "resources/html/application/income-tab.html",
		controller : "IncomeTabController",
		title : "تعبئة/إستكمال الطلب"
	}).when("/application/8", {
		templateUrl : "resources/html/application/review-tab.html",
		controller : "ReviewTabController",
		title : "تعبئة/إستكمال الطلب"
	}).when("/application/7", {
		templateUrl : "resources/html/application/document-management.html",
		controller : "DocumentManagementController",
		title : "تعبئة/إستكمال الطلب"
	});
}]);

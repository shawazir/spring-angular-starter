var faqControllers = angular.module("faqControllers", []);

faqControllers.controller("ListFaqsController", ["$scope", "$rootScope", "FaqService", "AlertService", function($scope, $rootScope, FaqService, AlertService) {
	$scope.categories = null;
	$scope.faqs = null;
	$scope.selectedCategoryId = null;

	FaqService.getFaqCategories().success(function(categories) {
		FaqService.getFaqs().success(function(faqs) {
			$scope.categories = categories;
			$scope.faqs = faqs;

			// $scope.selectedCategoryId = $scope.categories[0].id; // Selects the first category by default
		}).error(function(data) {
			AlertService.error($rootScope);
		}); 
	}).error(function(data) {
		AlertService.error($rootScope);
	});

	$scope.setSelectedCategoryId = function(selectedCategoryId) {
		$scope.selectedCategoryId = selectedCategoryId;
	}
}]);

consentControllers.controller("AsdController", ["$scope", "$rootScope", "$http", "$location" , "API_ROOT_URL", "ApplicantService", "AlertService","LoginService","AuthService", function($scope, $rootScope, $http, $location , API_ROOT_URL, ApplicantService, AlertService,LoginService,AuthService) {
	// NEW(91001), INVALID(91002), VALID(91003), UNDER_VALIDATION(91004);
	var ibanStatus = 91003;

	$scope.enableEditingIban = function() {
		$scope.editingIbanIsEnabled = true;
	}

	if (ibanStatus === 91001) {
		$scope.editingIbanIsEnabled = true;
		$scope.showEditIbanBtn = false;
		$scope.showIbanStatusMsg = false;
		$scope.ibanStatusMsg = null;
	} else if (ibanStatus === 91002) {
		$scope.editingIbanIsEnabled = true;
		$scope.showEditIbanBtn = false;
		$scope.showIbanStatusMsg = true;
		$scope.ibanStatusMsg = "رقم الحساب البنكي الذي أدخلته سابقا غير صحيح";
	} else if (ibanStatus === 91003) {
		$scope.editingIbanIsEnabled = false;
		$scope.showEditIbanBtn = true;
		$scope.showIbanStatusMsg = false;
		$scope.ibanStatusMsg = null;
	} else if (ibanStatus === 91004) {
		$scope.editingIbanIsEnabled = false;
		$scope.showEditIbanBtn = false;
		$scope.showIbanStatusMsg = true;
		$scope.ibanStatusMsg = "جاري التحقق من رقم الحساب البنكي الذي تم إدخاله سابقا";
	}
}]);
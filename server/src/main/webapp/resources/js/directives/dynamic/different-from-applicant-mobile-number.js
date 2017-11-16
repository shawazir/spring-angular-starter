angular.module("myApp").directive("myDifferentFromApplicantMobileNumber", ["$rootScope", function($rootScope) {
	return {
		restrict: "A",
		require : "ngModel",
		link: function(scope, element, attrs, ctrl) {
			var ERROR_NAME = "differentfromapplicantmobilenumber";

			scope.$watch(attrs.ngModel, function() {
				var isValueEmpty = (ctrl.$viewValue === undefined || ctrl.$viewValue === null || ctrl.$viewValue === "");
				if (isValueEmpty) {
					ctrl.$setValidity(ERROR_NAME, true);
				} else {
					if (ctrl.$viewValue == $rootScope.loggedInUser.mobileNumber) {
						ctrl.$setValidity(ERROR_NAME, false);
					} else {
						ctrl.$setValidity(ERROR_NAME, true);
					}
				}
			});
		}
	};
}]);
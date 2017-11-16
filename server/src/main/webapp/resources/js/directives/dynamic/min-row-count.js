angular.module("myApp").directive("myMinRowCount", function() {
	return {
		restrict: "A",
		require : "ngModel",
		link: function(scope, element, attrs, ctrl) {
			var ERROR_NAME = "minrowcount";
			var INTEGER_REGEXP = /^\-?\d+$/;

			function validateInteger(num) {
				if (INTEGER_REGEXP.test(num)) {
					return true;
				} else {
					return false;
				}
			}

			scope.$watch(attrs.ngModel, function() {
				var isValueEmpty = (ctrl.$viewValue === undefined || ctrl.$viewValue === null || ctrl.$viewValue === "");
				if (isValueEmpty) {
					ctrl.$setValidity(ERROR_NAME, true);
				} else if (!validateInteger(ctrl.$viewValue)) {
					ctrl.$setValidity(ERROR_NAME, true);
				} else {
					if (parseInt(ctrl.$viewValue) >= parseInt(attrs.myMinRowCount)) {
						ctrl.$setValidity(ERROR_NAME, true);
					} else {
						ctrl.$setValidity(ERROR_NAME, false);
					}
				}
			});
		}
	};
});

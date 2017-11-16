angular.module("myApp").directive("myMaxInteger", function() {
	return {
		restrict: "A",
		require : "ngModel",
		link: function(scope, element, attrs, ctrl) {
			var ERROR_NAME = "maxinteger";
			var INTEGER_REGEXP = /^\-?\d+$/;

			function validateInteger(num) {
				if (INTEGER_REGEXP.test(num)) {
					return true;
				} else {
					return false;
				}
			}

			function validateMinValue(minValue) {
				var isMinValueEmpty = (minValue === undefined || minValue === null || minValue === "");
				var isMinValueNotInteger = validateInteger();
				if (isMinValueEmpty || isMinValueNotInteger) {
					return false;
				} else {
					return true;
				}
			}

			if (!validateMinValue(attrs.myMaxInteger)) {
				throw "Max value is invalid";
				return;
			}

			scope.$watch(attrs.ngModel, function() {
				var isValueEmpty = (ctrl.$viewValue === undefined || ctrl.$viewValue === null || ctrl.$viewValue === "");
				if (isValueEmpty) {
					ctrl.$setValidity(ERROR_NAME, true);
				} else if (!validateInteger(ctrl.$viewValue)) {
					ctrl.$setValidity(ERROR_NAME, true);
				} else {
					if (parseInt(ctrl.$viewValue) <= parseInt(attrs.myMaxInteger)) {
						ctrl.$setValidity(ERROR_NAME, true);
					} else {
						ctrl.$setValidity(ERROR_NAME, false);
					}
				}
			});
		}
	};
});

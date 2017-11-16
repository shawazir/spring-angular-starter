angular.module("myApp").directive("myPattern", function() {
	return {
		restrict: "A",
		require : "ngModel",
		link: function(scope, element, attrs, ctrl) {
			var ERROR_NAME = "pattern";
			var pattern = undefined;

			attrs.$observe("myPattern", function(value) {
				pattern = value;
			});

			function validatePattern(value, patternStr) {
				var pattern = new RegExp(patternStr);
				if (pattern.test(value)) {
					return true;
				} else {
					return false;
				}
			}

			scope.$watch(attrs.ngModel, function() {
				var isValueEmpty = (ctrl.$viewValue === undefined || ctrl.$viewValue === null || ctrl.$viewValue === "" || pattern === undefined || pattern === null || pattern === "");
				if (isValueEmpty) {
					ctrl.$setValidity(ERROR_NAME, true);
				} else {
					var valid = validatePattern(ctrl.$viewValue, pattern);
					ctrl.$setValidity(ERROR_NAME, valid);
				}
			});
		}
	};
});

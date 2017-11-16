angular.module("myApp").directive("myCheckEqualValues", function() {
	return {
		restrict: "A",
		scope: true,
		require : "ngModel",
		link : function(scope, element, attrs, ctrl) {
			var ERROR_NAME = "equalvalues";
			var firstValueName = attrs.ngModel;
			var secondValueName = attrs.myCheckEqualValues;
			var caseSensitive = isCaseSensitive();

			function checkTheTwoValues() {
				try {
					var firstValue = eval("scope." + attrs.ngModel);
					var secondValue = eval("scope." + attrs.myCheckEqualValues); 
					if (!firstValue || !secondValue) {
						ctrl.$setValidity(ERROR_NAME, true);
					} else if (caseSensitive && firstValue === secondValue) {
						ctrl.$setValidity(ERROR_NAME, true);
					} else if (!caseSensitive && firstValue.toLowerCase() === secondValue.toLowerCase()) {
						ctrl.$setValidity(ERROR_NAME, true);
					} else {
						ctrl.$setValidity(ERROR_NAME, false);
					}
				} catch (error) {
					ctrl.$setValidity(ERROR_NAME, true);
				}
			}

			function isCaseSensitive() {
				if (!attrs.myCheckEqualValuesCaseSensitive) {
					return false;
				} else if (attrs.myCheckEqualValuesCaseSensitive.toLowerCase() === "false") {
					return false;
				} else if (attrs.myCheckEqualValuesCaseSensitive.toLowerCase() === "true") {
					return true;
				}
			}

			scope.$watch(firstValueName, function() {
				checkTheTwoValues();
			});
			scope.$watch(secondValueName, function() {
				checkTheTwoValues();
			});
		}
	};
});

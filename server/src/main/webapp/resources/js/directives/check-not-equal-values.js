angular.module("myApp").directive("myCheckNotEqualValues", function() {
	return {
		restrict: "A",
		scope: true,
		require : "ngModel",
		link : function(scope, element, attrs, ctrl) {
			var ERROR_NAME = "notequalvalues";
			var firstValueName = attrs.ngModel;
			var secondValueName = attrs.myCheckNotEqualValues;
			var caseSensitive = isCaseSensitive();

			function checkTheTwoValues() {
				try {
					var firstValue = eval("scope." + attrs.ngModel);
					var secondValue = eval("scope." + attrs.myCheckNotEqualValues); 
					if (!firstValue || !secondValue) {
						ctrl.$setValidity(ERROR_NAME, true);
					} else if (caseSensitive && firstValue === secondValue) {
						ctrl.$setValidity(ERROR_NAME, false);
					} else if (!caseSensitive && firstValue.toLowerCase() === secondValue.toLowerCase()) {
						ctrl.$setValidity(ERROR_NAME, false);
					} else {
						ctrl.$setValidity(ERROR_NAME, true);
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

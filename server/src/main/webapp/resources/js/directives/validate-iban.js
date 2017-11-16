angular.module("myApp").directive("validateIban", function() {
	return {
		restrict : "A",
		require : 'ngModel',
		priority : 0,
		link : function(scope, element, attrs, ctrl) {
			var ERROR_NAME = "incorrectIban";
			var Iban_pattern = /^SA[0-9]{22}$/ ;
			function validateIban(ngModelValue) {
				if(Iban_pattern.test(ngModelValue)){
					return true;
				}else{
					return false;
				}
			}
			
			scope.$watch(attrs.ngModel, function() {
				var isValueEmpty = (ctrl.$viewValue === undefined || ctrl.$viewValue === null || ctrl.$viewValue === "");
				if (isValueEmpty) {
					ctrl.$setValidity(ERROR_NAME, true);
				} else if (!validateIban(ctrl.$viewValue)) {
					ctrl.$setValidity(ERROR_NAME, false);
				} else {
					ctrl.$setValidity(ERROR_NAME, true);
				}
			});
		}
	};
});

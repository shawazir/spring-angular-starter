/**
 * This directive should be used on the day field
 */
angular.module("myApp").directive("myCheckHijriDate", function() {
	return {
		restrict: "A",
		scope: true,
		require : "ngModel",
		link : function(scope, element, attrs, ctrl) {
			function checkDate() {
				var ERROR_NAME = "invalidhijridate";
				try {
					var dayValue = eval("scope." + attrs.ngModel);
					var monthValue = eval("scope." + attrs.ngModel.replace("day", "month"));
					var yearValue = eval("scope." + attrs.ngModel.replace("day", "year"));
					if (!dayValue || !monthValue || !yearValue || isValidDate(yearValue, monthValue, dayValue)) {
						ctrl.$setValidity(ERROR_NAME, true);
					} else {
						ctrl.$setValidity(ERROR_NAME, false);
					}
				} catch (error) {
					ctrl.$setValidity(ERROR_NAME, true);
				}
			}

			function isValidDate(year, month, day)
			{
			    // Check the ranges of month and year
			    if(year < 1000 || year > 3000 || month < 1 || month > 12 || day < 1 || day > 30)
			    {
			        return false;
			    } else {
			    	return true;
			    }
			}

			var dayValueName = attrs.ngModel;
			var monthValueName = attrs.ngModel.replace("day", "month");
			var yearValueName = attrs.ngModel.replace("day", "year");
			scope.$watch(dayValueName, function() {
				checkDate();
			});
			scope.$watch(monthValueName, function() {
				checkDate();
			});
			scope.$watch(yearValueName, function() {
				checkDate();
			});
		}
	};
});

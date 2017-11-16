/**
 * This directive should be used on the day field
 */
angular.module("myApp").directive("myCheckGregorianDate", function() {
	return {
		restrict: "A",
		scope: true,
		require : "ngModel",
		link : function(scope, element, attrs, ctrl) {
			function checkDate() {
				var ERROR_NAME = "invalidgregoriandate";
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

			/**
			 * Source: http://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript
			 */
			function isValidDate(year, month, day)
			{
			    // Check the ranges of month and year
			    if(year < 1000 || year > 3000 || month < 1 || month > 12)
			    {
			        return false;
			    }

			    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

			    // Adjust for leap years
			    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
			    {
			        monthLength[1] = 29;
			    }

			    // Check the range of the day
			    return day > 0 && day <= monthLength[month - 1];
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

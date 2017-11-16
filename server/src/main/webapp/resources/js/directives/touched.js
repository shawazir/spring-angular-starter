angular.module("myApp").directive("myTouched", function() {
	var CLASS_NAME = "ng-touched";
	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, element, attrs, ctrl) {
			ctrl.$touched = false;
			element.bind("blur", function() {
				element.addClass(CLASS_NAME);
				scope.$apply(function() {
					ctrl.$touched = true;
				});
			});
		}
	}
});
angular.module("myApp").directive("myLinkedDropdownlistOptions", function() {
	return {
		restrict: "EA",
		require : "ngModel",
		link : function(scope, element, attrs, ctrl) {

			scope.$watch(attrs.myLinkedDropdownlistOptions, function(newValue, oldValue) {
				if (!!oldValue && newValue != oldValue) {
					ctrl.$setViewValue(null);
				}
			});
		}
	};
});

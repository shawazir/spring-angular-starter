angular.module("myApp").directive("myUnique", [ "$http", "$timeout", "API_ROOT_URL", function($http, $timeout, API_ROOT_URL) {
	return {
		restrict: "A",
		require : "ngModel",
		link : function(scope, element, attrs, ctrl) {
			var url = undefined;
			var initialValue = undefined;
			var timeout = undefined;
			var timeoutPeriod = 500;

			attrs.$observe("myUnique", function(value){
				url = value;
				if (url.charAt(url.length - 1) !== "/") {
					url = url + "/";
				}
			});

			attrs.$observe("myUniqueExcludedId", function(value){
				if (angular.isDefined(value)) {
					excludedId = "/" + value;
				} else {
					excludedId = "";
				}
			});

			scope.$watch(attrs.ngModel, function() {
				if (initialValue === undefined) {
					initialValue = ctrl.$viewValue;
				} else if (initialValue === ctrl.$viewValue) {
					return;
				}

				if (angular.isDefined(ctrl.$viewValue) && angular.isDefined(url)) {
					if (timeout) {
						$timeout.cancel(timeout);
					}
					timeout = $timeout(function() {
						$http({
							method : "GET",
							url : API_ROOT_URL + url + ctrl.$viewValue + excludedId
						}).success(function(data, status, headers, cfg) {
							ctrl.$setValidity("unique", data == "false");
						}).error(function(data, status, headers, cfg) {
							ctrl.$setValidity("unique", false);
						});
					}, timeoutPeriod);
				}
			});
		}
	};
}]);

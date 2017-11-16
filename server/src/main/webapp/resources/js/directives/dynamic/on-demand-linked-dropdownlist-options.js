angular.module("myApp").directive("myOnDemandLinkedDropdownlistOptions", ["$rootScope", "DynamicLookupService", function($rootScope, DynamicLookupService) {
	return {
		restrict: "EA",
		require : "ngModel",
		link : function(scope, element, attrs, ctrl) {
			var componentName = attrs.name;
			var lookupGroupId = attrs.myOnDemandLinkedDropdownlistOptionsLookupGroupId;
			if (!scope.onDemandLinkedLists) {
				scope.onDemandLinkedLists = new Object();
			}
			if (!$rootScope.cachedOnDemandLinkedLists) {
				$rootScope.cachedOnDemandLinkedLists = new Object();
			}

			scope.$watch(attrs.myOnDemandLinkedDropdownlistOptions, function(newValue, oldValue) {
				if (!!newValue) {
					var cachedListName = lookupGroupId + "-" + newValue;
					if (!!$rootScope.cachedOnDemandLinkedLists[cachedListName]) {
						scope.onDemandLinkedLists[componentName] = $rootScope.cachedOnDemandLinkedLists[cachedListName];
					} else {
						DynamicLookupService.getLookupListByParentId(lookupGroupId, newValue).success(function(data) {
							$rootScope.cachedOnDemandLinkedLists[cachedListName] = data;
							scope.onDemandLinkedLists[componentName] = data;
						});
					}
				}
				if (!!oldValue && newValue != oldValue) {
					ctrl.$setViewValue(null);
				}
			});
		}
	};
}]);

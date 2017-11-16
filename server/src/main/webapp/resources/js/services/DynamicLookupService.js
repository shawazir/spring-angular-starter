angular.module("myApp").factory("DynamicLookupService", ["$http", "API_ROOT_URL", function($http, API_ROOT_URL) {
	return {
		getLookupList: function(lookupGroupId) {
			return $http.get(API_ROOT_URL + "/dynamic-application/lookup-list/" + lookupGroupId);
		},
		getLookupListByParentId: function(lookupGroupId, parentId) {
			return $http.get(API_ROOT_URL + "/dynamic-application/lookup-list/" + lookupGroupId + "/" + parentId);
		},
		getLookupItem: function(lookupItemId, lookupGroupId) {
			return $http.get(API_ROOT_URL + "/dynamic-application/lookup-item/" + lookupItemId + "/" + lookupGroupId);
		}
	};
}]);
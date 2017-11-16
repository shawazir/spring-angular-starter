angular.module("dynamicFilters", []).filter("dynOnDemandLookup", ["DynamicLookupService", function(DynamicLookupService) {
	var INITIAL_EMPTY_VALUE = "";
	var cache = new Array();

	function decorateFilter(input, lookupGroupId) {
		if (!input) {
			return;
		}

		if (!cache[input] || cache[input].retrieved === false) {
			if (!cache[input]) {
				cache[input] = new Object();
				cache[input].value = null;
				cache[input].retrieved = false;

				DynamicLookupService.getLookupItem(input, lookupGroupId).success(function(data) {
					cache[input].value = data;
					cache[input].retrieved = true;
				}).error(function(data) {
					cache[input].value = "";
					cache[input].retrieved = true;
					throw "Error while retrieving lookup value; dynamic-filters.js";
				});
			}
			return INITIAL_EMPTY_VALUE;
		}
		else {
			return cache[input].value.label;
		}
	}
	decorateFilter.$stateful = true;
	return decorateFilter;
}]);

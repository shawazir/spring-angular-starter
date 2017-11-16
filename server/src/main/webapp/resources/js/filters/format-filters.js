angular.module("formatFilters", []).filter("default", function() {
	return function(input, defaultValue) {
		if (!input) {
			if (!!defaultValue) {
				return defaultValue;
			} else {
				return "-";
			}
		} else {
			return input;
		}
	};
}).filter("dateObject", function() {
	return function(input) {
		if (input && input.day && input.month && input.year) {
			return padNumber(input.day, 2) + "-" + padNumber(input.month, 2) + "-" + input.year;
		} else {
			return "";
		}
	};
}).filter("dateInt", function() {
	return function(input) {
		if (input) {
			var date = input + "";
			var day = date.substr(6, 2);
			var month = date.substr(4, 2);
			var year = date.substr(0, 4);
			return year + "-" + month + "-" + day;
		} else {
			return "";
		}
	};
}).filter("cycleInt", function() {
	return function(input) {
		if (input) {
			var date = input + "";
			var day = date.substr(6, 2);
			var month = date.substr(4, 2);
			var year = date.substr(0, 4);
			return year + "-" + month ;
		} else {
			return "";
		}
	};
});
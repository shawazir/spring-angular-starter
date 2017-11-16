/**
 * Attributes that could be used:
 * myGregorianDateOptions:
 * 		Possibles values: ('Day', 'Days', 'Month', 'Months', 'Year' or 'Years'); case insensitive.
 * myGregorianDateOptionsStartingYear:
 * 		Sets the years starting value.
 * 		Possibles values: ('Current', 'Last', 'Next', 'Current+n', 'Current-n' or n); where 'n' is an integer, and all laterals are case insensitive.
 * myGregorianDateOptionsEndingYear:
 * 		Sets the years ending value.
 * 		Possibles values: ('Current', 'Last', 'Next', 'Current+n', 'Current-n' or n); where 'n' is an integer, and all laterals are case insensitive.
 */
angular.module("myApp").directive("myGregorianDateOptions", function() {
	return {
		restrict: "A",
		template: function(tElement, tAttrs){
			var DEFAULT_DAYS_START = 1;
			var DEFAULT_DAYS_END = 31;
			var DEFAULT_MONTHS_START = 1;
			var DEFAULT_MONTHS_END = 12;
			var DEFAULT_YEARS_START = new Date().getFullYear();
			var DEFAULT_YEARS_END = 1970;

			function padNumber(num, paddingSize) {
				var numString = num + "";
				while (numString.length < paddingSize) {
					numString = "0" + numString;
				}
				return numString;
			}

			function buildOptionsHtml(from, to) {
				var ascending = ((to - from) >= 0);

				var outputHtml = "";
				if (ascending === true) {
					for (var i = from; i <= to; i++) {
						outputHtml = outputHtml + "<option value='" + padNumber(i, 2) + "'>" + padNumber(i, 2) + "</option>";
					}
				} else {
					for (var i = from; i >= to; i--) {
						outputHtml = outputHtml + "<option value='" + padNumber(i, 2) + "'>" + padNumber(i, 2) + "</option>";
					}
				}
				return outputHtml;
			}

			function parseYearString(yearInput, defaultValue) {
				if (yearInput === undefined || yearInput === null) {
					return defaultValue;
				}

				var lcYearsStartInput = yearInput.trim().toLowerCase();
				if (lcYearsStartInput === "last") {
					return new Date().getFullYear() - 1;
				} else if (lcYearsStartInput === "next") {
					return new Date().getFullYear() + 1;
				} else if (lcYearsStartInput.substr(0, 7) === "current") {
					lcYearsStartInput = lcYearsStartInput.replace(/ /g, "");
					if (lcYearsStartInput === "current") {
						return new Date().getFullYear();
					} else if (lcYearsStartInput.substr(0, 8) === "current+") {
						var number = parseInteger(lcYearsStartInput.substr(8));
						if (number !== null) {
							return new Date().getFullYear() + number;
						} else {
							return defaultValue;
						}
					} else if (lcYearsStartInput.substr(0, 8) === "current-") {
						var number = parseInteger(lcYearsStartInput.substr(8));
						if (number !== null) {
							return new Date().getFullYear() - number;
						} else {
							return defaultValue;
						}
					}
				} else if (isInteger(lcYearsStartInput)) {
					return parseInt(lcYearsStartInput);
				} else {
					return defaultValue;
				}
			}

			var datePart = tAttrs.myGregorianDateOptions.toLowerCase();
			if (datePart === "day" || datePart === "days") {
				return buildOptionsHtml(DEFAULT_DAYS_START, DEFAULT_DAYS_END);
			} else if (datePart === "month" || datePart === "months") {
				return buildOptionsHtml(DEFAULT_MONTHS_START, DEFAULT_MONTHS_END);
			} else if (datePart === "year" || datePart === "years") {
				var startingYearInput = tAttrs.myGregorianDateOptionsStartingYear;
				var endingYearInput = tAttrs.myGregorianDateOptionsEndingYear;
				return buildOptionsHtml(parseYearString(startingYearInput, DEFAULT_YEARS_START), parseYearString(endingYearInput, DEFAULT_YEARS_END));
			} else {
				return "";
			}
	    }
	};
});

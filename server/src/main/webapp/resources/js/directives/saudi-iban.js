angular.module("myApp").directive("mySaudiIban", function() {
	return {
		restrict: "A",
		require : "ngModel",
		link: function(scope, element, attrs, ctrl) {
			var ERROR_NAME = "saudiiban";
			var letters = new Array ("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
			var digits = new Array ("10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35");

			function validateIban(iban) {
				// Capitalize the letters
				iban = iban.toUpperCase();

				// Validates the Saudi IBAN pattern
				if (!iban.startsWith("SA")) {
					return false;
				}

				// Validates that the check digits are not 00, 01 or 99
				var checkDigits = iban.substring(2, 4);
				if (checkDigits === "00" || checkDigits === "01" || checkDigits === "99") {
					return false;
				}

				// Move the country letters and check digits to the end
				iban = iban.substring(4) + iban.substring(0, 4);

				// Replace the letters with digits
				for (i = 0; i < letters.length; i++) {
					iban = replaceAll(iban, letters[i], digits[i]);
				}

				// Calculate modulo 97 remainder
				var remainder = modulo97Remainder(iban);

				if (remainder == "1") {
					return true;
				} else {
					return false;
				}
			}

			function modulo97Remainder(iban) {
				var coss = Math.ceil(iban.length / 7);
				var remainder = "";
			    for (i = 1; i <= coss; i++) {
			    	remainder = String(parseFloat(remainder + iban.substr((i - 1) * 7, 7)) % 97);
			    }
			    return remainder;
			}

			function replaceAll(str, from, to) {
				return str.replace(new RegExp(from, "g"), to);
			}

			scope.$watch(attrs.ngModel, function() {
				var isValueEmpty = (ctrl.$viewValue === undefined || ctrl.$viewValue === null || ctrl.$viewValue === "");
				if (isValueEmpty) {
					ctrl.$setValidity(ERROR_NAME, true);
				} else {
					var iban = ctrl.$viewValue;
					if (validateIban(iban)) {
						iban = iban.toUpperCase();
						ctrl.$setViewValue(iban);
						ctrl.$render();
						ctrl.$setValidity(ERROR_NAME, true);
					} else {
						ctrl.$setValidity(ERROR_NAME, false);
					}
				}
			});
		}
	};
});

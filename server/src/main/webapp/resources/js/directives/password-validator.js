angular.module("myApp").directive("myPasswordValidator", function() {
	return {
		restrict: "A",
		require : "ngModel",
		link: function(scope, element, attrs, ctrl) {
			
			var ERROR_NAME = "weekpassword";

			//this will be get from cacheservice
			//now is configured to MOSA
			specs = {
					getMinimumLength : 6,
					getMaximumLength: 10,
					getAllowedSpecialCharacters: '@#$%*',
					hasCapitalLetters : false,
					hasSmalllLetters : false,
					hasNumbers : true,
					hasSpecialCharacters : false
			};
			
			function containsAtLestOneChar(pass, characters) {
				for (var i = 0; i < characters.length; i++) {
					var c = characters.charAt(i);
					if (pass.indexOf(c) >= 0) {
						return true;
					};
				};
				return false;
			};
			
			function charsInRange(pass, x, y) {
				for (var i = 0; i < pass.length; i++) {
					var c = pass.charCodeAt(i);
					if (c >= x && c <= y) {
						return true;
					};
				};
				return false;
			};
			
			
		function validatePassword(password) {
			var valid = true;
			if (password.length < specs.getMinimumLength || password.length > specs.getMaximumLength) {
				return false;
			};	
			
			// Numbers 0-9 character capital or small length 6-10
			var pattern = new RegExp("((?=.*[0-9])(?=.*[a-zA-Z]).{6,10})");
			valid = pattern.test(password);
			
			return valid;
		};

			scope.$watch(attrs.ngModel, function() {
				var isValueEmpty = (ctrl.$viewValue === undefined || ctrl.$viewValue === null || ctrl.$viewValue === "");
				if (isValueEmpty) {
					ctrl.$setValidity(ERROR_NAME, true);
				} else {
					var valid = validatePassword(ctrl.$viewValue);
					ctrl.$setValidity(ERROR_NAME, valid);
				};
			});
		}
	};
});

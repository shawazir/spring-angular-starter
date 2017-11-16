/**
 * this directive to validate if the Saudi IBAN for dynamic IBAN component apply the checksum calculation 
 */

angular.module("myApp").directive("myMinIban", function() {
	return {
		priority: 0,
		restrict: "A",
		scope: true,
		require : '^form',
		link : function(scope, element, attrs, ctrl) {
			var ERROR_NAME = "myMinIban";
			var IBAN = "";
			
			function validateMyIban() {
				//validate Saudi IBAN
				var S = 28;
				var A = 10;
				
				var ibanValue = "";
				for(i=1 ; i< 7 ; i++){
					ibanValue = ibanValue + ctrl[attrs.myMinIban + i].$viewValue;
				}
				
				if(ibanValue.length === 22){
					var calculatedIban = ibanValue.substring(2) + S + A + ctrl[attrs.myMinIban + 1].$viewValue;
					
					//apply the IBAN validation algorithm and set validation on the first input
					ibanCtrl1 = ctrl[attrs.myMinIban + 1];
					if(mod97(calculatedIban) !== 1){							
						ibanCtrl1.$setValidity(ERROR_NAME, false);
					}else{
						ibanCtrl1.$setValidity(ERROR_NAME, true);
					}
				}else {
					return false;
				}
			
			}
			//validate and return the checksum for the IBAN
			function mod97(string) {
			    var checksum = string.slice(0, 2),
			        fragment;

			    for(var offset = 2 ; offset < string.length ; offset += 7) {
			      fragment = String(checksum) + string.substring(offset, offset + 7);
			      checksum = parseInt(fragment, 10) % 97;
			    }

			    return checksum;
			  }
			
			function checkMyIban(partNumber , newValue) {

				var ibanCtrl = ctrl[attrs.myMinIban + partNumber] ;

				try {

					if(partNumber === 1){
						if (!newValue ||newValue.length < 2 || !(!isNaN(newValue) && angular.isNumber(+newValue))){
							ibanCtrl.$setValidity(ERROR_NAME, false);
						}else{
							ibanCtrl.$setValidity(ERROR_NAME, true);
						}
					} else {
						if (!newValue ||newValue.length < 4 || !(!isNaN(newValue) && angular.isNumber(+newValue))){
							ibanCtrl.$setValidity(ERROR_NAME, false);
						}else{
							ibanCtrl.$setValidity(ERROR_NAME, true);
						}
					}
					
					validateMyIban();
				} catch (error) {
					ibanCtrl.$setValidity(ERROR_NAME, true);	
					}
			}
			var ibanPart1 = attrs.ngModel;
			var ibanPart2 = attrs.ngModel.replace("part1", "part2");
			var ibanPart3 = attrs.ngModel.replace("part1", "part3");
			var ibanPart4 = attrs.ngModel.replace("part1", "part4");
			var ibanPart5 = attrs.ngModel.replace("part1", "part5");
			var ibanPart6 = attrs.ngModel.replace("part1", "part6");
			
			scope.$watch(ibanPart1, function(newValue, oldValue) {
				if(newValue == oldValue) return;
				IBAN = IBAN + newValue;
				checkMyIban(1 , newValue);
			});
			scope.$watch(ibanPart2, function(newValue, oldValue) {
				if(newValue == oldValue) return;
				IBAN = IBAN + newValue;
				checkMyIban(2 , newValue);
			});
			scope.$watch(ibanPart3, function(newValue, oldValue) {
				if(newValue == oldValue) return;
				IBAN = IBAN + newValue;
				checkMyIban(3 , newValue);
			});
			scope.$watch(ibanPart4, function(newValue, oldValue) {
				if(newValue == oldValue) return;
				IBAN = IBAN + newValue;
				checkMyIban(4 , newValue);
			});
			scope.$watch(ibanPart5, function(newValue, oldValue) {
				if(newValue == oldValue) return;
				IBAN = IBAN + newValue;
				checkMyIban(5 , newValue);
			});
			scope.$watch(ibanPart6, function(newValue, oldValue) {
				if(newValue == oldValue) return;
				IBAN = IBAN + newValue;
				checkMyIban(6 , newValue);
			});
		}
	};
});

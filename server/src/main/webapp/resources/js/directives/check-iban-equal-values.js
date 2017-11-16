/**
 * this directive to compare the similarity between tow IBANs.
 * attribute being used:
 * myCheckIbanEqualValues : contain the name of the other component.
 */


angular.module("myApp").directive("myCheckIbanEqualValues", function() {
	return {
		restrict: "A",
		scope: false,
		require : '^form',
		link : function(scope, element, attrs, ctrl) {
			function checkTheTwoIban(partNumber , newValue, oldValue) {
				var ERROR_NAME = "ibanEqualvalues";
				try {

					var ibanConfirmationCtrl = ctrl[attrs.name.replace("1", partNumber)];
					newValue = eval("scope." + attrs.ngModel.replace("part1", ("part" + partNumber)));
					var otherIbanValue = eval("scope." + attrs.ngModel.replace(attrs.name.slice(0, -1) + ".part1" , attrs.myCheckIbanEqualValues + (".part" + partNumber)));
					
		
					if (!newValue ||!otherIbanValue || !(newValue === otherIbanValue) || !(!isNaN(newValue) && angular.isNumber(+newValue))){
						//ibanConfirmationCtrl.$setViewValue(newValue);
						ibanConfirmationCtrl.$setValidity(ERROR_NAME, false);
					}else{
						ibanConfirmationCtrl.$setValidity(ERROR_NAME, true);
					}
				} catch (error) {
					ibanConfirmationCtrl.$setValidity(ERROR_NAME, true);
				}
			}
			var ibanConfirmationPart1 = attrs.ngModel;
			var ibanConfirmationPart2 = attrs.ngModel.replace("part1", "part2");
			var ibanConfirmationPart3 = attrs.ngModel.replace("part1", "part3");
			var ibanConfirmationPart4 = attrs.ngModel.replace("part1", "part4");
			var ibanConfirmationPart5 = attrs.ngModel.replace("part1", "part5");
			var ibanConfirmationPart6 = attrs.ngModel.replace("part1", "part6");
			
			var ibanPart1 = attrs.ngModel.replace(attrs.name.slice(0, -1) + ".part1" , attrs.myCheckIbanEqualValues + ".part1");
			var ibanPart2 = attrs.ngModel.replace(attrs.name.slice(0, -1) + ".part1" , attrs.myCheckIbanEqualValues + ".part2");
			var ibanPart3 = attrs.ngModel.replace(attrs.name.slice(0, -1) + ".part1" , attrs.myCheckIbanEqualValues + ".part3");
			var ibanPart4 = attrs.ngModel.replace(attrs.name.slice(0, -1) + ".part1" , attrs.myCheckIbanEqualValues + ".part4");
			var ibanPart5 = attrs.ngModel.replace(attrs.name.slice(0, -1) + ".part1" , attrs.myCheckIbanEqualValues + ".part5");
			var ibanPart6 = attrs.ngModel.replace(attrs.name.slice(0, -1) + ".part1" , attrs.myCheckIbanEqualValues + ".part6");
	
			scope.$watch(ibanPart1, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(1,newValue, oldValue);
			});
			scope.$watch(ibanPart2, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(2,newValue, oldValue);
			});
			scope.$watch(ibanPart3, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(3,newValue, oldValue);
			});
			scope.$watch(ibanPart4, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(4,newValue, oldValue);
			});
			scope.$watch(ibanPart5, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(5,newValue, oldValue);
			});
			scope.$watch(ibanPart6, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(6,newValue, oldValue);
			});
			
			scope.$watch(ibanConfirmationPart1, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(1,newValue, oldValue);
			});
			scope.$watch(ibanConfirmationPart2, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(2,newValue, oldValue);
			});
			scope.$watch(ibanConfirmationPart3, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(3,newValue, oldValue);
			});
			scope.$watch(ibanConfirmationPart4, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(4,newValue, oldValue);
			});
			scope.$watch(ibanConfirmationPart5, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(5,newValue, oldValue);
			});
			scope.$watch(ibanConfirmationPart6, function(newValue, oldValue) {
				 if(newValue === oldValue) return;
				checkTheTwoIban(6,newValue, oldValue);
			});
			
		}
	};
});
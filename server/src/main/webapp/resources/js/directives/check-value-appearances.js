angular.module("myApp").directive("myCheckValueAppearances", ["$rootScope", function($rootScope) {
	return {
		restrict: "A",
		require : "ngModel",
		link: function(scope, element, attrs, ctrl) {
			var ERROR_NAME = "numberOfAppeareances";
			var listOfAttributes = scope.$eval(attrs['myCheckValueAppearances']);
			var editableItemName = attrs.ngModel.substring(0, attrs.ngModel.indexOf(".data"));
			var itemsListName = attrs.ngModel.substring(0, attrs.ngModel.indexOf("editableItem")) + "items";

			scope.$watch(attrs.ngModel, function() {
				var editableItem = eval("scope." + editableItemName);
				var itemsList = eval("scope." + itemsListName);
				var isAttributeNameEmpty = listOfAttributes.length == 0;
				var isValueEmpty = (ctrl.$viewValue === undefined || ctrl.$viewValue === null || ctrl.$viewValue === "");
				if(isAttributeNameEmpty){
					alert("this should not happen, you have passed empty attributes to myCheckValueAppearances directive ");
				}else if (isValueEmpty) {
					for(var i=0;i<listOfAttributes.length;i++){
						var ERROR_NAME = listOfAttributes[i].errorName;
						ctrl.$setValidity(ERROR_NAME, true);
					}
				} else {
					
					for(var i=0;i<listOfAttributes.length;i++){
						
						var attributeName = listOfAttributes[i].attributeName;
						var valueToBeChecked = listOfAttributes[i].valueToBeChecked;
						var numberOfAllowedAppearances = listOfAttributes[i].numberOfAllowedAppearances;
						var ERROR_NAME = listOfAttributes[i].errorName;
						
						if(ctrl.$viewValue == valueToBeChecked){
							var numberOfAppearances = 0;
							var itemsListLength = itemsList == undefined? 0:itemsList.length;
							for (var i = 0; i < itemsListLength; i++) {
								if (i != editableItem.index) {
									if (ctrl.$viewValue == itemsList[i][attributeName]){
										numberOfAppearances++;
									}
									
								}
							}
							
							if ( numberOfAppearances >= numberOfAllowedAppearances) {
								ctrl.$setValidity(ERROR_NAME, false);
								return;
							}else{
								ctrl.$setValidity(ERROR_NAME, true);
								var index = i;
								for(var i = index ; i < listOfAttributes.length; i++){
									if(i != index){
										var RESET_ERROR_NAME = listOfAttributes[i].errorName;
										ctrl.$setValidity(RESET_ERROR_NAME, true);
									}
								}
								return;
							}
							
						}else{
							ctrl.$setValidity(ERROR_NAME, true);
							
						}
					}
					return;
					
				}
			});
		}
	};
}]);

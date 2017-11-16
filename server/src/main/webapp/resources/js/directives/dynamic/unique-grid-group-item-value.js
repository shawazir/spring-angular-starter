angular.module("myApp").directive("myUniqueGridGroupItemValue", ["$rootScope", function($rootScope) {
	return {
		restrict: "A",
		require : "ngModel",
		link: function(scope, element, attrs, ctrl) {
			var ERROR_NAME = "uniquegridgroupitemvalue";
			var attributeName = attrs.myUniqueGridGroupItemValue;
			var editableItemName = attrs.ngModel.substring(0, attrs.ngModel.indexOf(".data"));
			var itemsListName = attrs.ngModel.substring(0, attrs.ngModel.indexOf("editableItem")) + "items";

			scope.$watch(attrs.ngModel, function() {
				var editableItem = eval("scope." + editableItemName);
				var itemsList = eval("scope." + itemsListName);
				var isAttributeNameEmpty = (attributeName === undefined || attributeName === null || attributeName === "");
				var isValueEmpty = (ctrl.$viewValue === undefined || ctrl.$viewValue === null || ctrl.$viewValue === "");
				if (isAttributeNameEmpty || isValueEmpty) {
					ctrl.$setValidity(ERROR_NAME, true);
				} else {
					for (var i = 0; i < itemsList.length; i++) {
						if (i != editableItem.index) {
							if (ctrl.$viewValue == itemsList[i][attributeName]) {
								ctrl.$setValidity(ERROR_NAME, false);
								return
							}
						}
					}
					ctrl.$setValidity(ERROR_NAME, true);
				}
			});
		}
	};
}]);

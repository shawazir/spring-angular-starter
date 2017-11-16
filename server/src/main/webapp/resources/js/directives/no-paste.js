angular.module("myApp").directive("myNoPaste", function() {
	return {
		restrict: "A",
		link : function(scope, element, attrs) {
			element.on("paste", function(event) {
				event.preventDefault();
			});
		}
	};
});

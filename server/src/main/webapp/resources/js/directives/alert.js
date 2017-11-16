angular.module("myApp").directive("myAlert", function() {
	return {
		restrict: "EA",
		link : function(scope, element, attrs) {
			var alertType = attrs.myAlertType;
			var alertMsg = attrs.myAlertMsg;
			var outputHtml = "<div class='alert alert-" + alertType + "'>" + alertMsg + "</div>";
			element.replaceWith(outputHtml);
	    }
	};
});

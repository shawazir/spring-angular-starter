angular.module("myApp").directive("myTooltip", function() {
	return {
		restrict: "EA",
		link : function(scope, element, attrs) {

			attrs.$observe("myTooltip", function(value) {
				if (value) {
					buildTooltip(value);
				}
			});

			function buildTooltip(message) {
				var tooltipId = "tooltip-" + Math.floor((Math.random() * 10000) + 1);
				var outputHtml = "<i id='" + tooltipId + "' class='fa fa-exclamation-circle' data-toggle='tooltip' data-placement='top' title='" + message + "'></i>";
				element.replaceWith(outputHtml);
				$("#" + tooltipId).tooltip();
			}
	    }
	};
});

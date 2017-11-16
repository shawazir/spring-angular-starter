/**
 * This directive needs jQuery
 */
angular.module("myApp").directive("myConfirmModal", function() {
	return {
		restrict: "A",
		priority: 1,
		terminal: true,
		scope: {
			action: "&ngClick"
		},
		link: function(scope, element, attrs) {
			var msg = "هل أنت متأكد؟";
			if (attrs.myConfirmModal) {
				msg = attrs.myConfirmModal;
			}
			var modalId = "modal-" + Math.floor((Math.random() * 10000) + 1);
			var modalHtml = "<div id='" + modalId + "' class='modal fade' tabindex='-1' role='dialog'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h4 class='modal-title'>تأكيد</h4></div><div class='modal-body'><p>" + msg + "</p></div><div class='modal-footer'><button type='button' class='btn btn-default close-btn' data-dismiss='modal'>لا</button><button type='button' class='btn btn-primary ok-btn'>نعم</button></div></div></div></div>";

			$("[ng-view]").append(modalHtml);

			element.bind("click", function() {
				$("#" + modalId).modal("show").find(".modal-dialog").css({'margin-top': function() {
					return (($(window).height() - $(this).height()) / 2) - 300;
				}});
			});

			$("#" + modalId + " .ok-btn").bind("click", function() {
				$("#" + modalId).modal("hide");
				scope.$apply(function() {
					scope.action();
				});
			});
		}
	};
});

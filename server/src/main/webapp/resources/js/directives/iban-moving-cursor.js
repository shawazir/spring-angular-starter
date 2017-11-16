angular.module("myApp").directive("myIbanMovingCursor", function() {
	return {
		restrict: "A",
		priority: 3,
		link : function(scope, element, attrs) {
				element.bind('keyup', function (e) {
					if(e.keyCode >= 48 && e.keyCode <=57 || e.keyCode >= 96 && e.keyCode <=105){ // keyboard key numbers 0123456789
					ibanValue = eval("scope." + attrs.ngModel);
					// up arrow
			          if(attrs.ngModel.substr(attrs.ngModel.length - 1) == 1 && ibanValue && ibanValue.length === 2) {
			        	  element[0].nextElementSibling.focus();
			          }
			        // down arrow
			          if(attrs.ngModel.substr(attrs.ngModel.length - 1) != 1 && ibanValue && ibanValue.length === 4) {
			        	  element[0].nextElementSibling.focus();
			          }
				}
			      });
			}
	};
});

//angular.module("myApp").directive('fileParser', ['$parse', function ($parse) {
//    return {
//        require: 'ngModel',
//    	restrict: 'A',
//        link: function(scope, element, attrs ,ctrl) {
//            var model = $parse(attrs.fileParser);
//            var modelSetter = model.assign;
//                        
//            element.bind('change', function(){
//                scope.$apply(function(){
//                    modelSetter(scope, element[0].files[0]);
//                });
//            });
//        }
//    };
//}]);
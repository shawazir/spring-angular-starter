dynamicPagesControllers.controller("AppealController",["$scope","$rootScope","$http","$routeParams","$location","DynamicPagesService","AlertService","API_ROOT_URL","$filter","ApplicationService",
	function($scope, $rootScope, $http, $routeParams,$location, DynamicPagesService, AlertService,API_ROOT_URL, $filter,ApplicationService) {
	
	
	$scope.data = [{
		appealId : null,
		appealCreationDate : null,
		primaryCategory : null,
		secondaryCategory : null,
		appealStatus : null,
		appealDecision : null,
		appealRejectionReason : null,
		applicationId : null,
		nin : null,
		dependentNin : null
	}]
	
	ApplicationService.viewAppeals($routeParams.pageNumber).then(function(data) {
			$scope.data = data.data.value.appeals;
			$scope.appealsCount = data.data.value.appealCount;
			$scope.currntPage = $routeParams.pageNumber;
	}, function(data) {
		var defaultErrorMessage = "لا يمكن عرض البيانات الآن الرجاء المحاولة لاحقا";
		if (!!data.data.message) {
			AlertService.error($scope,data.data.message);
		} else if (!!defaultErrorMessage) {
			AlertService.error($scope,defaultErrorMessage);
		} else {
			AlertService.error($scope);
		}
		});
	
	$scope.raiseAppeal = function(){
		ApplicationService.raiseAppeal().then(function(data){
			AlertService.success($scope,"تم استقبال طلب الاعتراض");
		}, function(reason){
			AlertService.error($scope);
		});
	}
	
}]);
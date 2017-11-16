var suggestionControllers = angular.module("suggestionControllers", []);

suggestionControllers.controller("CreateSuggestionController", ["$scope","$rootScope","SuggestionService","AlertService","$location", function($scope,$rootScope,SuggestionService,AlertService,$location) {
	
	$scope.programs = [];
	$scope.question = new Object();
	$scope.question.type = 0;
	SuggestionService.getAllQuestions().success(function(suggestions) {
		$scope.programs = suggestions.value;
		
	}).error(function(){

	});
	
	$scope.save = function () {
		var data = new Object();
		data.type = $scope.question.key;
		data.subType = $scope.question.subType;
		data.text = $scope.question.text;
		SuggestionService.save(data).success(function(data) {
			AlertService.success($rootScope, "تم ارسال طلب المساعدة");
			$location.path("/start");
		}).error(function() {
			AlertService.error($rootScope);
		});
	};
	
	$scope.cancel=  function(){ 
		$location.path("/start");
	};
	
}]);


var homeControllers = angular.module("homeControllers", []);

homeControllers.controller("HomeController", ["$scope" ,"$location", "HomeService",  "SharedDataService",function($scope , $location , HomeService, SharedDataService) {
	
	$scope.colorsForProgram = ['blue', 'red', 'green', 'gold'];
	
	HomeService.getAllActiveHomeContent().success(function(data) {
		$scope.allActiveNews = data.news;
		$scope.allActiveBanners = data.banners;
		$scope.allActiveTextSlider = data.textSliders;
		$scope.chanckOfTextSlider = [];
		for (var i = 0; i < $scope.allActiveTextSlider.length; i += 4) {
			$scope.chanckOfTextSlider.push($scope.allActiveTextSlider.slice(i, 4 + i));
		}  
	}).error(function() {
		
	});
	
	$scope.getTimes=function(n){
	     return new Array(n);
	};
}]);
homeControllers.controller("AboutProgramController", ["$scope", "SharedDataService", function($scope, SharedDataService) {
	var program = SharedDataService.get();
	$scope.name = program.name;
	$scope.description = program.description;
}]);

homeControllers.controller("ListNewsController", ["$scope", "HomeService", function($scope, HomeService) {
	
      
}]);

homeControllers.controller("UsageConditionsController", ["$scope", function($scope) {
	
}]);

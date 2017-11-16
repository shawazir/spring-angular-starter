var alertControllers = angular.module("alertControllers", []);

alertControllers.controller("ViewAlertController", ["$scope","$http", "$location" , "API_ROOT_URL", function($scope, $http, $location , API_ROOT_URL) {
	
	$http.get(API_ROOT_URL + "/alert/view?applicantReferenceNumber=12345").success(function(data) {
		$scope.alerts = data;
	}).error(function(data) {
		console.log(data);
	});
	
	$scope.goHome= function() {
		$location.path("/");
	};
	
}]);

alertControllers.controller("CreateAlertController", ["$scope","$http", "$location" , "API_ROOT_URL", function($scope, $http, $location , API_ROOT_URL) {

	$scope.error = false; 
	
	$scope.createNewAlert = function (){
		var alert = {
				alertTitle : $scope.atitle,
				alertContent : $scope.acontent
				
		};
		$http.post(API_ROOT_URL + "/alert/create" , alert).success(function(status) {
			console.log(status);
			$location.path("/");
		}).error(function(status) {
			console.log(status);
			$scope.error = true; 
		});
		
	};
	
}]);
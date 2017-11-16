var calculatorControllers = angular.module("calculatorControllers", []);

calculatorControllers.controller("GetPaymentAmountController", ["$scope", "CalculatorService", function($scope, CalculatorService) {

	$scope.paymentAmount = 0;
	$scope.formInput = new Object();
	$scope.formInput.noOfAdultDependents = null;
	$scope.formInput.noOfNonAdultDependents = null;
	$scope.formInput.familyIncome = null;

	$scope.submitForm = function(formInput) {
		$scope.actionInProgress = true;

		CalculatorService.getPaymentAmount(formInput).success(function(result) {
			$scope.actionInProgress = false;
			$scope.paymentAmount = result.value;
		}, function(reason) {
			$scope.actionInProgress = false;
			AlertService.error($scope);
		});
	}
}]);

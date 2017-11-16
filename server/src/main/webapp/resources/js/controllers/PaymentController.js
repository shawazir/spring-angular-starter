/**
 * @author nalnumay
 *
 */

var PaymentControllers = angular.module("paymentControllers", []);

PaymentControllers.controller("PaymentController", ["$scope", "$rootScope","$http", "$location" , "PaymentService" , "AlertService", function($scope, $rootScope, $http, $location , PaymentService , AlertService) {
	 
	PaymentService.getCurrentPaymentInfo().success(function(result) {
		$scope.paymentInfo = result.value.value;
		$scope.actionInProgress = false;
		
	}).error(function(result) {
		AlertService.error($rootScope);
	});
	
	PaymentService.checkIfRejectedPaymentExist().success(function(result){
		
		$scope.isRejectedPaymentExist=result.value;
		
		
		}).error(function(result){});

	
	$scope.getPaymentHistory = function(){
		
		if($scope.actionInProgress ==true || $scope.isPaymentHistoryLoaded)
			return;
		
		$scope.actionInProgress = true;
		PaymentService.getPaymentHistory().success(function(result) {
			$scope.paymentHistory = result.value.value;
			$scope.actionInProgress = false;
			$scope.showPaymentHistory = true;
			$scope.isPaymentHistoryLoaded = true;
		}).error(function(result) {
			AlertService.error($rootScope);
		});
	}
	
	$scope.resumePayment = function(){
		PaymentService.resumePayment().success(function(result){
			if(result.value != null){
				if(result.value == 1){
					AlertService.success($scope,"لقد تم استلام طلبك لإعادة صرف المستحقات وجاري التحقق من صحة رقم الآيبان المدخل");
				}else if(result.value == 0){
					AlertService.success($scope,"لقد تم استلام طلبك، سيتم إعادة صرف المدفعات المالية");
					$rootScope.loggedInUser.applicant.bankAccountStatus = 31002;
				}else if(result.value == 2){
					AlertService.success($scope,"تم استلام طلبكم مسبقاً، سيتم الدفع في حال كان رقم الحساب البنكي الجديد صحيح، في حال كان رقم الحساب البنكي غير صحيح فيجب إدخال رقم آخر صحيح والضغط على زر  تأكيد الحساب البنكي مرة  أخرى");
				}
			}else
				AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
		});
	}
}]);


PaymentControllers.controller("PaymentSummaryController", ["$scope", "$rootScope","$http", "$location" , "PaymentService" , "AlertService", function($scope, $rootScope, $http, $location , PaymentService , AlertService) {
	 
	PaymentService.getPaymentSummary().success(function(result) {
		$scope.paymentSummary = result.value.value;
		$scope.actionInProgress = false;
		
	}).error(function(result) {
		AlertService.error($rootScope);
	});

	
}]);




var startControllers = angular.module("startControllers", []);

startControllers.controller("StartController", ["$rootScope", "AuthService", "AlertService","$scope","$http","API_ROOT_URL","ApplicationService", function($rootScope, AuthService, AlertService, $scope, $http, API_ROOT_URL, ApplicationService) {
	$scope.showConfirmIban = true;
	var ext = $rootScope.loggedInUser.ext;
	var isRegisteredDssUser = ext.dssBeneficiaryProfileStatus == $rootScope.cache.enums.DssBeneficiaryProfileStatus.REGISTERED_USER;
	var isDssFirstLoginMessageShown = ext.isDssFirstLoginMessageShown === true;
	var isFirstLogin = $rootScope.loggedInUser.lastLoginTimestamp == null;
	var needsPasswordReset = $rootScope.loggedInUser.needsPasswordReset === true;
	if (isRegisteredDssUser && !isDssFirstLoginMessageShown && isFirstLogin && !needsPasswordReset) {
		var warningMessage = "عزيزي مستفيد (الضمان الاجتماعي)، أنت مؤهل مبدئيا لبرنامج حساب المواطن، يمكنك تحديث بياناتك وإضافة تابعين";
		AlertService.warning("warning", warningMessage, true);
		ext.isDssFirstLoginMessageShown = true;
	}
	
	$scope.confirmIban = function(){
		if($scope.loggedInUser.applicant.bankAccountStatus == 31001){
			AlertService
			.success($scope,
					"تم استلام طلبكم مسبقاً، سيتم الدفع في حال كان رقم الحساب البنكي الجديد صحيح، في حال كان رقم الحساب البنكي غير صحيح فيجب إدخال رقم آخر صحيح والضغط على زر 'تأكيد الحساب البنكي' مرة  أخرى");
			return;
		}
		ApplicationService.resumePayment().then(function(data){
			var defaultErrorMessage = "لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً";
			if(null == data.data.value){
				AlertService.error($scope,defaultErrorMessage)
			}else if(data.data.value == 2){
				AlertService.success($scope,"تم استلام طلبكم مسبقاً، سيتم الدفع في حال كان رقم الحساب البنكي الجديد صحيح، في حال كان رقم الحساب البنكي غير صحيح فيجب إدخال رقم آخر صحيح والضغط على زر 'تأكيد الحساب البنكي' مرة  أخرى")
			}else if(data.data.value == 1){
				AlertService.success($scope,"لقد تم استلام طلبك لإعادة صرف المستحقات وجاري التحقق من صحة رقم الآيبان المدخل")
			}else if(data.data.value == 0){
				AlertService.success($scope,"لقد تم استلام طلبك، سيتم إعادة صرف المدفعات المالية")
				$scope.showConfirmIban = false;
			}
		})
	}
	
	$scope.reapply = function(){
		ApplicationService.reapply().then(function(data){
			if(data.data.value == 0){
				AlertService.success($scope,"تم استقبال طلبك لإعادة التقديم");
				return;
			}else if(data.data.value == 100){
				AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
			}
		},function(data){
			var defaultErrorMessage = "لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً";
			AlertService.error($scope,defaultErrorMessage);
		})
	}
	
	ApplicationService.checkReapplyState().then(function(data){
		$rootScope.reapplyState = data.data;
	},function(data){
		var defaultErrorMessage = "لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً";
		AlertService.error($scope,defaultErrorMessage);
	})
	
	
	
	
}]);

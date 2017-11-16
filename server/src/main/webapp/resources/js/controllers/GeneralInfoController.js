dynamicPagesControllers.controller("GeneralInfoTabController",["$scope","$rootScope","$http","$routeParams","$location","DynamicPagesService","AlertService","API_ROOT_URL","$filter","ApplicationService",
	function($scope, $rootScope, $http, $routeParams,$location, DynamicPagesService, AlertService,API_ROOT_URL, $filter,ApplicationService) {
	var pageNo = 200;
	var tabNo = 100;

	preventSkippingIncompleteTab(pageNo, tabNo,"application", DynamicPagesService,$location);
	$scope.saveInProgress = false;
	$scope.toggleArrayItem = toggleArrayItem;
	$scope.tab1Data = {};
	$scope.nav = {
		showNextBtn : true,
		showSubmitBtn : false,
		currentTabNumber : tabNo,
		totalTabsCount : 7,
		nextFunction : function() {
			$("#socialStatus-next-modale").modal("hide");
			var tabDataHasChanged = checkIfTabDataChanged($scope.nav.currentTabNumber,$scope.data, DynamicPagesService.getTabsDataArray());
			if (!tabDataHasChanged) {
				$location.path('/application/2');
				return;
			}
			$scope.saveInProgress = true;
			ApplicationService.saveGeneralInfo($scope.data).then(function(data){
				$scope.saveInProgress = false;
				$scope.oldSocialStatus = data.data.value.Social_Status;
				$rootScope.tabsDataArray[100 - 1] = $scope.data;
				// Setting dependent and income and profile statuses to new.
				if(!$scope.firstTimeSave){
					$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 200, $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE)
					$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 600, $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE)
					$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 700, $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE)
					$scope.loggedInUser.profileStatus = $scope.cache.enums.ProfileStatus.INCOMPLETE;
				}
				$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 100, $scope.cache.enums.ApplicantWizardTabStatus.COMPLETE)
				$location.path('/application/2');
				AlertService.roamingAlert('success','تم حفظ البيانات بنجاح');
			}, function(data) {
				$scope.saveInProgress = false;
				var defaultErrorMessage = "لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً";
				if (!!data.data.message) {
					AlertService.error($scope,data.data.message);
				} else if (!!defaultErrorMessage) {
					AlertService.error($scope,defaultErrorMessage);
				} else {
					AlertService.error($scope);
				}
			});
			
		}
	};
	
	$scope.data = {
			group2 : {
				Social_Status : null,
				Health_Status : null,
				Work_Ability_Status : null,
				Education_Status : null,
				Application_Education_ID:null
			}
	}
	
	ApplicationService.loadGeneralInfo().then(function(tabData1) {
			$scope.data.group2 = tabData1.data;
			$scope.oldSocialStatus = $scope.data.group2.Social_Status;
	}, function(reason) {
			AlertService.error($scope);
	});
	
	$scope.CheckAndSaveTabData = function(formWhere){
		// Check social status if first time or update
		$scope.firstTimeSave = checkSocialStatus();
		$scope.modaleContent = null;
		if($scope.firstTimeSave){
			if(formWhere == 'save'){
				$scope.saveTabData();
			}else
				$scope.nav.nextFunction();
		}else{
			if($scope.oldSocialStatus == $scope.cache.enums.MaritalStatus.MARRIED){
				if($scope.data.group2.Social_Status == $scope.cache.enums.MaritalStatus.DIVORCED || $scope.data.group2.Social_Status == $scope.cache.enums.MaritalStatus.WIDOW){
					$scope.modaleContent = "ملاحظة: سيتم حذف أي تابع بصلة قرابة (زوج أو زوجة)"
				}
				if($scope.data.group2.Social_Status == $scope.cache.enums.MaritalStatus.SINGLE){
					$scope.modaleContent = "ملاحظة: سيتم حذف أي تابع بصلة قرابة (زوج أو زوجة أو ابن أو ابنة)"
				}
			}
			if($scope.oldSocialStatus == $scope.cache.enums.MaritalStatus.DIVORCED  || $scope.oldSocialStatus == $scope.cache.enums.MaritalStatus.WIDOW){
				if($scope.data.group2.Social_Status == $scope.cache.enums.MaritalStatus.SINGLE){
					$scope.modaleContent = "ملاحظة: سيتم حذف أي تابع بصلة قرابة (ابن أو ابنة)"
				}
			}
			if(formWhere == 'save'){
				$("#socialStatus-save-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
					return (($(window).height() - $(this).height()) / 2) - 300;
				}});
			}else{
				$("#socialStatus-next-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
					return (($(window).height() - $(this).height()) / 2) - 300;
				}});
			}
		}
	}
	
	$scope.saveTabData = function(){
		$("#socialStatus-save-modale").modal("hide");
		var tabDataHasChanged = checkIfTabDataChanged($scope.nav.currentTabNumber,$scope.data, DynamicPagesService.getTabsDataArray());
		if (!tabDataHasChanged) {
			return;
		}
		$scope.saveInProgress = true;
		ApplicationService.saveGeneralInfo($scope.data).then(function(data){
			$scope.saveInProgress = false;
			$scope.oldSocialStatus = data.data.value.Social_Status;
			$rootScope.tabsDataArray[100 - 1] = $scope.data;
			// Setting dependent and income and profile statuses to new.
			if(!$scope.firstTimeSave){
				$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 200, $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE)
				$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 600, $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE)
				$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 700, $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE)
				$scope.loggedInUser.profileStatus = $scope.cache.enums.ProfileStatus.INCOMPLETE;
			}
			$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 100, $scope.cache.enums.ApplicantWizardTabStatus.COMPLETE)
			AlertService.success($scope,"تم حفظ البيانات بنجاح");
		}, function(data) {
			$scope.saveInProgress = false;
			var defaultErrorMessage = "لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً";
			if (!!data.data.message) {
				AlertService.error($scope,data.data.message);
			} else if (!!defaultErrorMessage) {
				AlertService.error($scope,defaultErrorMessage);
			} else {
				AlertService.error($scope);
			}
		});
		
	}
		
	
	checkSocialStatus = function(){
		if($scope.loggedInUser.wizardProgressInfo.getTabStatus(pageNo, tabNo) == $scope.cache.enums.ApplicantWizardTabStatus.COMPLETE){
			if($scope.oldSocialStatus != $scope.data.group2.Social_Status){
				return false;
			}else{
				return true;
			}
		}else{
			return true;
		}
	}
}]);
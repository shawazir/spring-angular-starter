dynamicPagesControllers.controller("DependentsAndIncomeTabController",["$scope","$rootScope","$http","$routeParams","$location","DynamicPagesService","AlertService","API_ROOT_URL","FileUploader","$filter","ApplicationService",
	function($scope, $rootScope, $http, $routeParams,$location, DynamicPagesService, AlertService,API_ROOT_URL, FileUploader, $filter,ApplicationService) {
		var pageNo = 200;
		var tabNo = 200;
		var generalInfoTabNo = 100;

		preventSkippingIncompleteTab(pageNo, tabNo,"application", DynamicPagesService,$location);
		$scope.saveInProgress = false;
		$scope.toggleArrayItem = toggleArrayItem;
		$scope.showAddForm = false;
		$scope.addNewItemToItemsList = addNewItemToItemsList;
		$scope.prepareItemForEditing = prepareItemForEditing;
		$scope.resetEditableItem = resetEditableItem;
		$scope.applyEdit = applyEdit;
		$scope.cancelEdit = cancelEdit;
		$scope.removeItem = removeItem;
		$scope.disableQuestions = false;
		$scope.tab1Data = {};
		$scope.nav = {
			showPreviousBtn : true,
			showNextBtn : true,
			showSubmitBtn : false,
			currentTabNumber : tabNo,
			totalTabsCount : 8,
			previousFunction : function() {
				$location.path('/application/2');
			},
			nextFunction : function() {
				$("#document-confirm-delete-modale").modal("hide");
				var checkQuestions = false;
				if(!!$scope.questionArr)
					checkQuestions = true;
				
				if(!checkQuestions && !($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE)){
					$scope.showFirstQuestionErrorMessage = true
					return;
				}
				
				if(checkQuestions && !($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE)){
					for (var k = 0; k < $scope.questionArr.length; k++) {
						if ($scope.questionArr[k].showFlag) {
							if (!$scope.questionArr[k].yesFlag
									&& !$scope.questionArr[k].noFlag) {
								$scope.questionArr[k].questionErrorMessage = "الرجاء الإجابة على الأسئلة";
								return;
							}
						}
					}
				}
				// Validate dependents are added for married applicants.
				$scope.validDependents = false;
				if($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE){
					if($scope.data.group4.items.length > 0){
						$scope.validDependents  = true;
					}
					if(!$scope.validDependents){
						AlertService.error($scope,"الرجاء إضافة تابع (واحد) على الأقل");
						return;
					}
				}
				if($scope.data.group11.HoH_Category != 51){
					if($scope.isWithDependent && $scope.data.group4.items.length == 0){
						AlertService.error($scope,"الرجاء إضافة تابع (واحد) على الأقل");
						return;
					}
				}
				if(checkQuestions && !($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE)){
					for (var i = 0; i < $scope.questionArr.length; i++) {
						if ($scope.questionArr[i].yesFlag == true) {
							$scope.data.group11.HoH_Category = $scope.questionArr[i].HoH_Category;
							break;
						}
					}
				}
				
				if (null == $scope.data.group11.HoH_Category)
					$scope.data.group11.HoH_Category = $scope.calculateHoh();
				
				if ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE && $scope.data.group11.HoH_Category != 51)
					$scope.data.group11.HoH_Category = 21;
				
				var tabDataHasChanged = checkIfTabDataChanged($scope.nav.currentTabNumber,$scope.data, DynamicPagesService.getTabsDataArray());
				if (!tabDataHasChanged) {
					$location.path('/application/4');
					return;
				}
				
				//If the editableItems have value
				if($scope.data.group4.editableItem.index != -1){
					$scope.data.group4.editableItem.data = $scope.data.group4.editableItem.referenceData;
					$scope.data.group4.editableItem.index = -1;
					$scope.data.group4.showAddForm = false;
				}
				
				$scope.saveInProgress = true;
				DynamicPagesService.saveTabData(pageNo,$scope.nav.currentTabNumber,$scope.data,"/applicant/save-dependents").then(function(data) {
					DynamicPagesService.setTabStatusToComplete(pageNo,$scope.nav.currentTabNumber);
					$scope.data = DynamicPagesService.processServerTabData(tabNo,data.value,$scope.data);
							
					$scope.saveInProgress = false;
					$scope.form.$submitted = false;
					$location.path('/application/4');
					AlertService.roamingAlert('success','تم حفظ البيانات بنجاح');
										
				},
					function(data) {
						$scope.saveInProgress = false;
						var defaultErrorMessage = 'لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً';
						if (!!data.message) {
							AlertService.error($scope,data.message);
						} else if (!!defaultErrorMessage) {
							AlertService.error($scope,defaultErrorMessage);
						} else {
							AlertService.error($scope);
						}
					});
			}
		};
		

		$scope.data = {
			group4 : {
				editableItem : {
					index : -1,
					data : {
						Dependent_Nin : null,
						Dependent_Date_Of_Birth_H : {
							day : null,
							month : null,
							year : null
						},
						Dependent_Date_Of_Birth_G : {
							day : null,
							month : null,
							year : null
						},
						Dependent_First_Name : null,
						Dependent_Father_Name : null,
						Dependent_Grandfather_Name : null,
						Dependent_Family_Name : null,
						Dependent_Gender : "",
						Dependent_Relationship : "",
						Dependent_Social_Status : "",
						Dependent_Employment_Status : "",
						Dependent_Life_Status : "",
						Dependent_ID_Expiry_Date_H : {
							day : null,
							month : null,
							year : null
						},
						Dependent_Income : null,
						Dependent_Additional_Income : null,
						Dependent_Type : null,
						GCC_Nationality : null,
						GCC_Dependent_Nin: null,
						DoB_Type : null,
						GCC_Nin_Type : null,
						GCC_Dependent_Passport : null,
						transaction_type : 1
					},
					referenceData : {
						Dependent_Nin : null,
						Dependent_Date_Of_Birth_H : {
							day : null,
							month : null,
							year : null
						},
						Dependent_Date_Of_Birth_G : {
							day : null,
							month : null,
							year : null
						},
						Dependent_First_Name : null,
						Dependent_Father_Name : null,
						Dependent_Grandfather_Name : null,
						Dependent_Family_Name : null,
						Dependent_Gender : "",
						Dependent_Relationship : "",
						Dependent_Social_Status : "",
						Dependent_Employment_Status : "",
						Dependent_Life_Status : "",
						Dependent_ID_Expiry_Date_H : {
							day : null,
							month : null,
							year : null
						},
						Dependent_Income : null,
						Dependent_Additional_Income : null,
						Dependent_Type : null,
						GCC_Nationality : null,
						GCC_Dependent_Nin: null,
						DoB_Type : null,
						GCC_Nin_Type : null,
						GCC_Dependent_Passport : null,
						transaction_type : 1
					}
				},
				items : [],
				removedItems : [],
				showAddForm : false
			},
			group11 : {
				HoH_Category : null
			}
		};

		$scope.tab1 = {
			group2 : {
				Social_Status : "",
				Health_Status : "",
				Work_Ability_Status : "",
				Education_Status : ""
			}
		};
		
		$scope.confirmHohChange = function(fromWhere){
			if(!!$rootScope.applicantEligibilityInfo){
				if($scope.oldHoh != $scope.data.group11.HoH_Category && ($rootScope.applicantEligibilityInfo.status == 0 || $rootScope.applicantEligibilityInfo.status == 2)){
					if(fromWhere == 'next')
						$scope.confirmAndSave = false;
					else
						$scope.confirmAndSave = true;
					
					$("#document-confirm-delete-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
						return (($(window).height() - $(this).height()) / 2) - 300;
					}});
					
				}else{
					if(fromWhere == 'next')
						$scope.nav.nextFunction();
					else
						$scope.saveTabData();
				}
			}else{
				if(fromWhere == 'next')
					$scope.nav.nextFunction();
				else
					$scope.saveTabData();
			}
		}

		DynamicPagesService.retrieveTabData(pageNo,$scope.nav.currentTabNumber,$scope.nav.totalTabsCount,$scope.data,"/applicant/load-dependents").then(function(tabData3) {
			DynamicPagesService.retrieveTabData(pageNo,generalInfoTabNo,$scope.nav.totalTabsCount,$scope.tab1).then(function(tabData1) {
				ApplicationService.getUploadedFiles().success(function(data) {
					$scope.data = tabData3;
					$scope.tab1 = tabData1;
					$scope.data.group11.HoH_Category = parseInt($scope.data.group11.HoH_Category);
					$scope.oldHoh = parseInt(tabData3.group11.HoH_Category);
					if($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.DIVORCED || $scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.WIDOW 
							|| !!$scope.data.group11.HoH_Category){
						if(tabData3.group4.items.length > 0){
							$scope.prepareQuestionsArr($scope.data.group11.HoH_Category , true);
						}else{
							$scope.prepareQuestionsArr($scope.data.group11.HoH_Category , false);
						}
					}
					$scope.disableQuestions = isQuestionsDisabled(data.value.length);
				},function(reason) {
					AlertService.error($scope);
				});
			},function(reason) {
				AlertService.error($scope);
			});
		}, function(reason) {
				AlertService.error($scope);
			});
		
		function isQuestionsDisabled(documentCount){
			if(!!$rootScope.applicantEligibilityInfo){
				if($rootScope.applicantEligibilityInfo.eligibilityStatus != 0 && $rootScope.applicantEligibilityInfo.eligibilityStatus != 2){
					if(documentCount > 0 || ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $rootScope.loggedInUser.gender == $scope.cache.enums.Gender.MALE) || $scope.data.group11.HoH_Category == 51 || 
							$rootScope.loggedInUser.profileStatus == $scope.cache.enums.ProfileStatus.COMPLETE){
						return true;
					}
				}
			}else if(documentCount > 0 || ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $rootScope.loggedInUser.gender == $scope.cache.enums.Gender.MALE) || $scope.data.group11.HoH_Category == 51 || 
					$rootScope.loggedInUser.profileStatus == $scope.cache.enums.ProfileStatus.COMPLETE){
				return true;
			}
			return false;
		}

		$scope.saveTabData = function() {
			$("#document-confirm-delete-modale").modal("hide");
			var checkQuestions = false;
			if(!!$scope.questionArr)
				checkQuestions = true;
			
			if(!checkQuestions && !($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE)){
				$scope.showFirstQuestionErrorMessage = true
				return;
			}
				
			if(checkQuestions && !($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE)){
				for (var k = 0; k < $scope.questionArr.length; k++) {
					if ($scope.questionArr[k].showFlag) {
						if (!$scope.questionArr[k].yesFlag
								&& !$scope.questionArr[k].noFlag) {
							if(parseInt($scope.questionArr[k].HoH_Category) == 22 || parseInt($scope.questionArr[k].HoH_Category) == 31 || parseInt($scope.questionArr[k].HoH_Category) == 23
									|| parseInt($scope.questionArr[k].HoH_Category) == 32){
								$scope.questionArr[k].questionErrorMessage = "الرجاء الإجابة على السؤال 'هل لديك تابعين أو معالين؟'"
							}else{
								$scope.questionArr[k].questionErrorMessage = "الرجاء الإجابة على الأسئلة";
							}
							return;
						}
					}
				}
			}
			// Validate dependents are added for married applicants.
			$scope.validDependents = false;
			if($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE){
				if($scope.data.group4.items.length > 0){
					$scope.validDependents  = true;
				}
				if(!$scope.validDependents){
					AlertService.error($scope,"الرجاء إضافة تابع (واحد) على الأقل");
					return;
				}
			}
			if($scope.data.group11.HoH_Category != 51){
				if($scope.isWithDependent && $scope.data.group4.items.length == 0){
					AlertService.error($scope,"الرجاء إضافة تابع (واحد) على الأقل");
					return;
				}
			}
			if(checkQuestions && !($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE)){
				for (var i = 0; i < $scope.questionArr.length; i++) {
					if ($scope.questionArr[i].yesFlag == true) {
						$scope.data.group11.HoH_Category = $scope.questionArr[i].HoH_Category;
						break;
					}
				}
			}
			if ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED
					&& $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE && $scope.data.group11.HoH_Category != 51)
				$scope.data.group11.HoH_Category = 21;

			if (null == $scope.data.group11.HoH_Category)
				$scope.data.group11.HoH_Category = $scope.calculateHoh();
			
			var tabDataHasChanged = checkIfTabDataChanged($scope.nav.currentTabNumber,$scope.data, DynamicPagesService.getTabsDataArray());
			if (!tabDataHasChanged) {
				return;
			}
			
			//If the editableItems have value
			if($scope.data.group4.editableItem.index != -1){
				$scope.data.group4.editableItem.data = $scope.data.group4.editableItem.referenceData;
				$scope.data.group4.editableItem.index = -1;
				$scope.data.group4.showAddForm = false;
			}
			
			$scope.saveInProgress = true;
			DynamicPagesService.saveTabData(pageNo,$scope.nav.currentTabNumber,$scope.data,"/applicant/save-dependents").then(function(data) {
				DynamicPagesService.setTabStatusToComplete(pageNo,$scope.nav.currentTabNumber);
				$scope.data = DynamicPagesService.processServerTabData(tabNo,data.value,$scope.data);
				
				$scope.saveInProgress = false;
				$scope.form.$submitted = false;
				AlertService.success($scope,"تم حفظ البيانات بنجاح");
			},function(data) {
				$scope.saveInProgress = false;
				var defaultErrorMessage = "لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً";
				if (!!data.message) {
					AlertService.error($scope,data.message);
				} else if (!!defaultErrorMessage) {
					AlertService.error($scope,defaultErrorMessage);
				} else {
					AlertService.error($scope);
				}
			});
		};
		
		$scope.calculateHoh = function(){
			var calculatedHoh = null;
			Social_Status = parseInt($scope.tab1.group2.Social_Status);
			switch(Social_Status){
			case $scope.cache.enums.MaritalStatus.MARRIED :
				if($scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE){
					calculatedHoh = 36;
				}
				break;
			case $scope.cache.enums.MaritalStatus.SINGLE :
				if($scope.data.group4.items.length > 0){
					calculatedHoh = 120;
				}else
					calculatedHoh = 110;
				break;
			case $scope.cache.enums.MaritalStatus.DIVORCED : 
				if($scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE && $scope.data.group4.items.length > 0){
					calculatedHoh = 220;
				}else if($scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE && $scope.data.group4.items.length > 0){
					calculatedHoh = 310;
				}else if($scope.data.group4.items.length == 0){
					calculatedHoh = 110;
				}
				break;
			case $scope.cache.enums.MaritalStatus.WIDOW : 
				if($scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE && $scope.data.group4.items.length > 0){
					calculatedHoh = 230;
				}else if($scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE && $scope.data.group4.items.length > 0){
					calculatedHoh = 320;
				}else if($scope.data.group4.items.length == 0){
					calculatedHoh = 110;
				}
				break;
			}
			return calculatedHoh;
		}
		
		$scope.addDependent = function(groupData){
			if(groupData.editableItem.data.Dependent_Type == $scope.cache.enums.DependentType.SAUDI && groupData.editableItem.data.Dependent_Nin.charAt(0) == 2){
				$scope.dependentTypeErrorMessage = true;
				return;
			}else if(groupData.editableItem.data.Dependent_Type == $scope.cache.enums.DependentType.NON_SAUDI && groupData.editableItem.data.Dependent_Nin.charAt(0) == 1){
				$scope.dependentTypeErrorMessage = true;
				return;
			}
			$scope.addNewItemToItemsList(groupData);
		}
		
		$scope.applyEditedDependent = function(groupData){
			if(groupData.editableItem.data.Dependent_Type == $scope.cache.enums.DependentType.SAUDI && groupData.editableItem.data.Dependent_Nin.charAt(0) == 2){
				$scope.dependentTypeErrorMessage = true;
				return;
			}else if(groupData.editableItem.data.Dependent_Type == $scope.cache.enums.DependentType.NON_SAUDI && groupData.editableItem.data.Dependent_Nin.charAt(0) == 1){
				$scope.dependentTypeErrorMessage = true;
				return;
			}
			$scope.applyEdit(groupData);
		}
		
		$scope.removeValidationMessage = function(){
			$scope.dependentTypeErrorMessage = false;
		}
		
		// preparing questions Array.
		$scope.prepareQuestionsArr = function(HoH_Category , isWithDependent) {
			$("#dependent-modale").modal("hide");
			$("#dependent-modale-2").modal("hide");
			if(isWithDependent){
				$('input[class=hohCategoryYes]').click();
				$('input[class=hohCategoryNo]').attr('checked',false);
			}
			$scope.questionArr = [];
			$scope.isWithDependent = isWithDependent;
			$scope.showFirstQuestionErrorMessage = false;
			if(isWithDependent || HoH_Category == "51"){
				$scope.hideDependent = false
				if(!!$scope.data.group4.removedItems)
					if($scope.data.group4.removedItems.length > 0){
						$scope.data.group4.items = $scope.data.group4.removedItems;
						$scope.data.group4.removedItems = [];
					}
			}else{
				for(var i = 0 ; i < $scope.data.group4.items.length ; i++){
					if(!!$scope.data.group4.items[i].Application_Dependents_ID){
						if(!$scope.data.group4.removedItems){
							$scope.data.group4.removedItems = [];
						}
						$scope.data.group4.removedItems.push($scope.data.group4.items[i]);
					}
				}
				$scope.data.group4.items = [];
			    if($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE){
					$scope.hideDependent = false;
				}else
					$scope.hideDependent = true;
			}

			if ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.DIVORCED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE) {
				$scope.questionArr.push({
					id : 11,
					questionString : "هل لديك تابعين أو معالين ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 22,
					QuestionErrorMessage : null
				});
			}

			if ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.DIVORCED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE) {
				$scope.questionArr.push({
					id : 11,
					questionString : "هل لديك تابعين أو معالين ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 31,
					QuestionErrorMessage : null
				});
			}

			if ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.WIDOW && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE) {
				$scope.questionArr.push({
					id : 11,
					questionString : "هل لديك تابعين أو معالين ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 23,
					QuestionErrorMessage : null
				});
			}

			if ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.WIDOW && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE) {
				$scope.questionArr.push({
					id : 11,
					questionString : "هل لديك تابعين أو معالين ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 32,
					QuestionErrorMessage : null
				});
			}

			if ((!isWithDependent || $scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.WIDOW || $scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.DIVORCED) 
					&& !($scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE && $scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED)) {
				$scope.questionArr.push({
					id : 1,
					questionString : "هل تعيش في سكن مستقل عن الأسرة ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 11,
					QuestionErrorMessage : null
				});
			}

			if (isWithDependent && !(($scope.tab1.group2.Social_Status != $scope.cache.enums.MaritalStatus.SINGLE && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE)
					|| ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE)
					|| ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.DIVORCED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE) || ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.WIDOW && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE))) {
				$scope.questionArr.push({
					id : 2,
					questionString : "هل أنت ولي أو عائل أو محتضن لتابعين ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 12,
					QuestionErrorMessage : null
				});
			}
			if (!(($scope.tab1.group2.Social_Status != $scope.cache.enums.MaritalStatus.SINGLE && $scope.loggedInUser.gender == $scope.cache.enums.Gender.MALE)
					|| ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE)
					|| ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.DIVORCED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE) || ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.WIDOW && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE))) {
				$scope.questionArr.push({
					id : 3,
					questionString : "هل أنت/أنتِ ابن/ابنة من أم غير سعودية ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 13,
					QuestionErrorMessage : null
				});
			}
			if ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.SINGLE || ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE)) {
				$scope.questionArr.push({
					id : 4,
					questionString : "هل عائل الأسرة فاقد الأهلية ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 41,
					QuestionErrorMessage : null
				});
			}
			if ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.SINGLE || ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE)) {
				$scope.questionArr.push({
					id : 5,
					questionString : "هل عائل الأسرة مسجون ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 42,
					questionErrorMessage : null
				});
			}
			if ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE) {
				$scope.questionArr.push({
					id : 8,
					questionString : "هل زوجكِ متغيب ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 33,
					questionErrorMessage : null
				});
			}
			if ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE) {
				$scope.questionArr.push({
					id : 9,
					questionString : "هل أنتِ مهجورة ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 34,
					questionErrorMessage : null
				});
			}
			if ($scope.tab1.group2.Social_Status == $scope.cache.enums.MaritalStatus.MARRIED && $scope.loggedInUser.gender == $scope.cache.enums.Gender.FEMALE) {
				$scope.questionArr.push({
					id : 10,
					questionString : "هل أنتِ متزوجة من غير سعودي ؟",
					showFlag : false,
					yesFlag : false,
					noFlag : false,
					HoH_Category : 35,
					questionErrorMessage : null
				});
			}
			if (HoH_Category == 0) {
				for (var j = 0; j < $scope.questionArr.length; j++) {
					$scope.questionArr[j].showFlag = true;
					$scope.questionArr[j].noFlag = true;
					$scope.questionArr[j].yesFlag = false;
				}
			} else if (HoH_Category) {
				for (var i = 0; i < $scope.questionArr.length; i++) {
					if ($scope.questionArr[i].HoH_Category == HoH_Category) {
						$scope.questionArr[i].yesFlag = true;
						$scope.questionArr[i].showFlag = true
						break;
					} else
						$scope.questionArr[i].noFlag = true;

					$scope.questionArr[i].showFlag = true
				}
			} else if ($scope.questionArr.length > 0) {
				$scope.questionArr[0].showFlag = true;
			}
		}
		
		$scope.checkQuestion = function(id){
			$("#dependent-modale").modal("hide");
			$("#dependent-modale-2").modal("hide");
			var intId = parseInt(id);
			if(intId == 0){
				$('input[class=hohCategoryNo11]').attr('checked',false);
				$('input[class=hohCategoryYes11]').click();
				$scope.hideOtherQuestions(11);
				return;
			}
			if(intId == 99){
				$scope.showNextQuestion(11);
				return;
			}
			if(intId == 11 && $scope.data.group4.items.length > 0){
				$("#dependent-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
					return (($(window).height() - $(this).height()) / 2) - 300;
				}});
			}else
				$scope.showNextQuestion(id);
		}
		
		$scope.showDependentModale2 = function(){
			if($scope.data.group4.items.length > 0){
				$("#dependent-modale-2").modal("show").find(".modal-dialog").css({'margin-top': function() {
					return (($(window).height() - $(this).height()) / 2) - 300;
				}});
			}else{
				$scope.data.group11.HoH_Category = null;
				$scope.prepareQuestionsArr(null , false); 
			}
		}

		$scope.hideOtherQuestions = function(id) {
			var index = -1;
			for (var i = 0; i < $scope.questionArr.length; i++) {
				if ($scope.questionArr[i].id === id) {
					index = i;
					break;
				}
			}
			$scope.data.group11.HoH_Category = $scope.questionArr[i].HoH_Category;
			$scope.questionArr[index].noFlag = false;
			$scope.questionArr[index].yesFlag = true;
			$scope.questionArr[index].questionErrorMessage = null;
			if (index > -1) {
				for (var j = index + 1; j < $scope.questionArr.length; j++) {
					$scope.questionArr[j].showFlag = false;
					$scope.questionArr[j].noFlag = false;
					$scope.questionArr[j].yesFlag = false;
				}
			}
			if($scope.questionArr[0].id == "11" && $scope.questionArr[0].noFlag){
				if($scope.data.group4.items.length > 0)
					$scope.data.group4.removedItems = $scope.data.group4.items;
				$scope.data.group4.items = [];
				$scope.hideDependent = true;
				$scope.isWithDependent = false;
			}else if($scope.questionArr[0].id == "11"){
				$scope.hideDependent = false;
				$scope.isWithDependent = true;
				if(!!$scope.data.group4.removedItems)
					if($scope.data.group4.removedItems.length > 0){
						$scope.data.group4.items = $scope.data.group4.removedItems;
						$scope.data.group4.removedItems = [];
					}
			}
		}

		$scope.showNextQuestion = function(id) {
			var index = -1;
			for (var i = 0; i < $scope.questionArr.length; i++) {
				if ($scope.questionArr[i].id === id) {
					index = i;
				} else if ($scope.questionArr[i].yesFlag == true)
					return;
			}
			$scope.questionArr[index].noFlag = true;
			$scope.questionArr[index].yesFlag = false;
			$scope.questionArr[index].questionErrorMessage = null;
			$scope.data.group11.HoH_Category = null;
			if (index > -1
					&& index != $scope.questionArr.length - 1) {
				$scope.questionArr[++index].showFlag = true;
				$scope.questionArr[index].noFlag = false;
				$scope.questionArr[index].yesFlag = false;
			}
			if($scope.questionArr[0].id == "11" && $scope.questionArr[0].noFlag){
				if($scope.data.group4.items.length > 0)
					$scope.data.group4.removedItems = $scope.data.group4.items;
				$scope.data.group4.items = [];
				$scope.hideDependent = true;
				$scope.isWithDependent = false;
			}else if($scope.questionArr[0].id == "11"){
				$scope.hideDependent = false;
				$scope.isWithDependent = true;
				if(!!$scope.data.group4.removedItems)
					if($scope.data.group4.removedItems.length > 0){
						$scope.data.group4.items = $scope.data.group4.removedItems;
						$scope.data.group4.removedItems = [];
					}
			}
		}

		$scope.resetDependentFields = function(){
			$scope.data.group4.editableItem.data.Dependent_Date_Of_Birth_H.day = null;
			$scope.data.group4.editableItem.data.Dependent_Date_Of_Birth_H.month = null;
			$scope.data.group4.editableItem.data.Dependent_Date_Of_Birth_H.year = null
			$scope.data.group4.editableItem.data.Dependent_Date_Of_Birth_G.day = null;
			$scope.data.group4.editableItem.data.Dependent_Date_Of_Birth_G.month= null;
			$scope.data.group4.editableItem.data.Dependent_Date_Of_Birth_G.year = null;
			$scope.data.group4.editableItem.data.GCC_Nationality = null;
			$scope.data.group4.editableItem.data.GCC_Dependent_Nin = null;
			$scope.data.group4.editableItem.data.DoB_Type = null;
			$scope.data.group4.editableItem.data.Dependent_Relationship = null;
			$scope.data.group4.editableItem.data.Dependent_Employment_Status = null;
			$scope.data.group4.editableItem.data.Dependent_Nin = null;
			$scope.data.group4.editableItem.data.GCC_Nin_Type = null;
			$scope.data.group4.editableItem.data.GCC_Dependent_Passport = null;
		}
		
		$scope.resetGCCDependentFields = function(){
			$scope.data.group4.editableItem.data.GCC_Dependent_Nin = null;
			$scope.data.group4.editableItem.data.GCC_Dependent_Passport = null;
		}
		
	} ]);
dynamicPagesControllers.controller("ReviewTabController",["$scope","$rootScope","$http","$routeParams","$location","DynamicPagesService","AlertService","ApplicationService","API_ROOT_URL","REVIEW_TAB_NO",
	function($scope, $rootScope, $http, $routeParams,$location, DynamicPagesService, AlertService,ApplicationService, API_ROOT_URL, REVIEW_TAB_NO) {
		var pageNo = 200;
		var tabNo = REVIEW_TAB_NO;

		preventSkippingIncompleteTab(pageNo, tabNo,"application", DynamicPagesService,$location);
		$scope.saveInProgress = false;
		$scope.toggleArrayItem = toggleArrayItem;
		$scope.showAddForm = false;
		$scope.addNewItemToItemsList = addNewItemToItemsList;
		$scope.prepareItemForEditing = prepareItemForEditing;
		$scope.applyEdit = applyEdit;
		$scope.cancelEdit = cancelEdit;
		$scope.removeItem = removeItem;
		$scope.tab1Data = {};
		$scope.disableSubmit = false;
		$scope.API_ROOT_URL = API_ROOT_URL;
		$scope.nav = {
			showPreviousBtn : true,
			showNextBtn : false,
			showSubmitBtn : true,
			currentTabNumber : tabNo,
			totalTabsCount : 8,
			previousFunction : function() {
				$location.path('/application/7');
			}
		};

		$scope.data = {
			group1 : {
				IBAN : null,
				IBAN_Confirmation : null
			},
			group2 : {
				Social_Status : "",
				Health_Status : "",
				Work_Ability_Status : "",
				Education_Status : ""
			},
			group5 : {
				House_Status : "",
				House_Type : "",
				Address_Region : "",
				Address_City : "",
				Address_District : "",
				Address_Street : null
			},
			group8 : {
				editableItem : {
					index : -1,
					data : {
						Deed_Number : null,
						Deed_Region : "",
						Deed_City : ""
					},
					referenceData : {
						Deed_Number : null,
						Deed_Region : "",
						Deed_City : ""
					}
				},
				items : [],
				showAddForm : false
			},
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
						Dependent_Additional_Income : null
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
						Dependent_Additional_Income : null
					}
				},
				items : [],
				showAddForm : false
			},
			group6 : {
				Address_Type : "",
				Address_House_Number : null,
				Address_Unit_Number : null,
				Address_Additional_Number : null,
				Address_Zip_Code : null,
				Address_PO_Box : null
			},
			group7 : {
				Additional_Mobile_Number : null,
				Land_Line : null,
				Email : null,
				Email_Confirmation : null
			},
			group9 : {
				Dependent_Type : "",
				Dependent_Files : null
			},
			group3 : {
				editableItem : {
					index : -1,
					data : {
						Attachment_File_Name : null,
						Income_Reference_Number : null,
						Income_Type : null,
						Income_Source : null,
						Monthly_Income  : null,
						Salary_Consent : null
					},
					referenceData : {
						Attachment_File_Name : null,
						Income_Reference_Number : null,
						Income_Type : null,
						Income_Source : null,
						Monthly_Income : null,
						Salary_Consent : null
					}
				},
				items : [],
				showAddForm : false
			},
			group12 : {
				editableItem : {
					index : -1,
					data : {
						Attachment_File_Name : null,
						Dependent_NIN : null,
						Income_Type : null,
						Income_Source : null,
						Monthly_Income  : null,
						Salary_Consent : null,
						Income_Reference_Number : null
					},
					referenceData : {
						Attachment_File_Name : null,
						Dependent_NIN : null,
						Income_Type : null,
						Income_Source : null,
						Monthly_Income  : null,
						Salary_Consent : null,
						Income_Reference_Number : null
					}
				},
				items : [],
				showAddForm : false
			},
			group13 : {
				Employment_Status : null
			}
		};
		
		ApplicationService.retrieveTab4Data().success(function(tab4Data) {
			DynamicPagesService.retrieveTabData(pageNo, 200, $scope.nav.totalTabsCount, $scope.data, "/applicant/load-dependents").then(function(tab3Data) {
					DynamicPagesService.retrieveTabData(200, $scope.nav.currentTabNumber, $scope.nav.totalTabsCount, $scope.data).then(function(tabData) {
						ApplicationService.getUploadedFiles().success(function(uploadedFiles) {
							ApplicationService.isRequiredDocument().then(function(data) {
								$scope.requiredDocument = data.data.value;
					$scope.data = tabData; // Review tab data
					$scope.tab3Data = tab3Data;
					$scope.tab4Data = tab4Data;
					$scope.uploadedFiles = uploadedFiles.value;

					var filesUploaded = null;
					if (uploadedFiles.value.length > 0) {
						filesUploaded = true;
					} else {
						filesUploaded = false;
					}
					if($scope.requiredDocument == 1 || $scope.requiredDocument == 3){
						$scope.documentsRequiredButNotUploaded = false;
					}else if($scope.requiredDocument == 2){
						$scope.documentsRequiredButNotUploaded = true;
					}
					
					for(var i = 0 ; i < $scope.tab3Data.group4.items.length ; i++){
						if($scope.tab3Data.group4.items[i].Dependent_Type == $scope.cache.enums.DependentType.GCC){
							if($scope.tab3Data.group4.items[i].GCC_Nin_Type == $scope.cache.enums.GccIdType.NIN){
								$scope.tab3Data.group4.items[i].Ui_Dependent_Nin = $scope.tab3Data.group4.items[i].GCC_Dependent_Nin; 
							}else
								$scope.tab3Data.group4.items[i].Ui_Dependent_Nin = $scope.tab3Data.group4.items[i].GCC_Dependent_Passport;
						}else
							$scope.tab3Data.group4.items[i].Ui_Dependent_Nin = $scope.tab3Data.group4.items[i].Dependent_Nin;
					}
					// Check Dependent and income tab statuses
					checkDependentAndIncomeStatuses();
				},
					function(reason) {
						AlertService.error($scope);
					});
				});
			}, function(reason) {
				AlertService.error($scope);
			});
		}, function(reason) {
			AlertService.error($scope);
		});
		}, function(data){
			AlertService.error($scope);
		});
		
		checkDependentAndIncomeStatuses = function(){
			if($scope.loggedInUser.wizardProgressInfo.getTabStatus(200, 200) == $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE || $scope.loggedInUser.wizardProgressInfo.getTabStatus(200, 600) == $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE || $scope.documentsRequiredButNotUploaded){
				$scope.showInCompleteErrorMessage = true;
				$scope.disableSubmitButton = true;
				$scope.UnCompleteErrorMessageContent = "الرجاء إكمال البيانات المطلوبة للقيام بتقديم الطلب كالتالي : (X)"
				var UnCompleteTabs = [];
				var UnCompleteTabsString = null;
				if($scope.loggedInUser.wizardProgressInfo.getTabStatus(200, 600) == $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE ){
					UnCompleteTabs.push("الإفصاح عن الدخل");
				} 
				if($scope.loggedInUser.wizardProgressInfo.getTabStatus(200, 200) == $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE){
					UnCompleteTabs.push("بيانات التابعين");
				}
				if($scope.documentsRequiredButNotUploaded){
					UnCompleteTabs.push("إدارة المرفقات");
				}
				for(var i = 0 ; i < UnCompleteTabs.length ; i++){
					if(i == 0){
						UnCompleteTabsString = UnCompleteTabs[i];
					}else{
						UnCompleteTabsString += " , ";
						UnCompleteTabsString += UnCompleteTabs[i];
					}
				}
				$scope.UnCompleteErrorMessageContent = $scope.UnCompleteErrorMessageContent.replace("X" , UnCompleteTabsString);
			}else{
				$scope.showInCompleteErrorMessage = false;
				$scope.disableSubmitButton = false;
			}
		}
		
		$scope.completeApplication = function() {
			$scope.saveInProgress = true;
			DynamicPagesService.completeApplication(200,$scope.nav.currentTabNumber).then(function(data) {
				$scope.saveInProgress = false;
				DynamicPagesService.setTabStatusToComplete(pageNo,$scope.nav.currentTabNumber);
				AlertService.roamingAlert("success","تم استلام طلبك بنجاح، سيتم الرد عليك بعد عملية التحقق من الطلب.");
				$rootScope.loggedInUser.profileStatus = $rootScope.cache.enums.ProfileStatus.COMPLETE;
				$location.path("/start");
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
	} ]);

dynamicPagesControllers.controller("IncomeTabController",["$scope","$rootScope","$http","$routeParams","$location","DynamicPagesService","AlertService","API_ROOT_URL","FileUploader","$filter","ApplicationService",
	function($scope, $rootScope, $http, $routeParams,$location, DynamicPagesService, AlertService,API_ROOT_URL, FileUploader, $filter,ApplicationService) {
		var pageNo = 200;
		var tabNo = 600;
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
		$scope.isDocumantsRejected = false;
		$scope.tab1Data = {};
		$scope.dependentEmploymentStatus = null;
		$scope.nav = {
			showPreviousBtn : true,
			showNextBtn : true,
			showSubmitBtn : false,
			currentTabNumber : tabNo,
			totalTabsCount : 8,
			previousFunction : function() {
				$location.path('/application/3');
			},
			nextFunction : function() {
				var vlaidBeneficiaryIncome = $scope.validateBeneficiaryIncome();
				var vlaidDependentIncome = $scope.validateDependentIncome();
				
				if(!vlaidBeneficiaryIncome || !vlaidDependentIncome){
					$scope.preparErrorMsg();
					
					if (!!$scope.errorMessage) {
						AlertService.error($scope,$scope.errorMessage);
					}else {
						AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
					}
					$scope.errorMessage = null;
					$scope.showBeneficiaryErrorMsg1 = false;
					$scope.showBeneficiaryErrorMsg2 = false;
					$scope.showBeneficiaryErrorMsg3 = false;
					$scope.showBeneficiaryErrorMsg4 = false;
					$scope.showDependentErrorMsg1 = false;
					$scope.showDependentErrorMsg2 = false;
					$scope.showDependentErrorMsg3 = false;
					$scope.showDependentErrorMsg4 = false;
					return;
				}else
				
				var tabDataHasChanged = checkIfTabDataChanged($scope.nav.currentTabNumber,$scope.data, DynamicPagesService.getTabsDataArray());
				if (!tabDataHasChanged) {
					$location.path('/application/5');
					return;
				}

				$scope.saveInProgress = true;
				DynamicPagesService.saveTabData(pageNo,$scope.nav.currentTabNumber,$scope.data,"/applicant-income/save").then(function(data) {
					DynamicPagesService.setTabStatusToComplete(pageNo,$scope.nav.currentTabNumber);
					$scope.data = DynamicPagesService.processServerTabData(tabNo,data.value,$scope.data);
					$scope.saveInProgress = false;
					$scope.form.$submitted = false;
					$location.path('/application/5');
					AlertService.roamingAlert('success','تم حفظ البيانات بنجاح');
				},function(data) {
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
			group3 : {
				editableItem : {
					index : -1,
					data : {
						Attachment_File_Name : null,
						Other_Income_Source : null,
						Income_Reference_Number : null,
						Income_Type : null,
						Income_Source : null,
						Monthly_Income  : 0,
						Salary_Consent : null,
						transaction_type : 1
					},
					referenceData : {
						Attachment_File_Name : null,
						Income_Reference_Number : null,
						Income_Type : null,
						Income_Source : null,
						Monthly_Income : 0,
						Salary_Consent : null,
						transaction_type : 1
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
						Other_Income_Source : null,
						Dependent_NIN : null,
						Income_Type : null,
						Income_Source : null,
						Monthly_Income  : 0,
						Salary_Consent : null,
						Income_Reference_Number : null,
						transaction_type : 1
					},
					referenceData : {
						Attachment_File_Name : null,
						Dependent_NIN : null,
						Income_Type : null,
						Income_Source : null,
						Monthly_Income  : 0,
						Salary_Consent : null,
						Income_Reference_Number : null,
						transaction_type : 1
					}
				},
				items : [],
				showAddForm : false
			},
			group13 : {
				Employment_Status : null
			}
		};
		$scope.data1 = {
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
		}

		DynamicPagesService.retrieveTabData(pageNo,200,$scope.nav.totalTabsCount,$scope.data1,"/applicant/load-dependents").then(function(tabData3) {
			$scope.data1.group4 = tabData3.group4;
			for(var i = 0 ; i < $scope.data1.group4.items.length ; i++){
				if($scope.data1.group4.items[i].Dependent_Type == $scope.cache.enums.DependentType.GCC){
					if($scope.data1.group4.items[i].GCC_Nin_Type == $scope.cache.enums.GccIdType.NIN){
						$scope.data1.group4.items[i].Ui_Dependent_Nin = $scope.data1.group4.items[i].GCC_Dependent_Nin; 
					}else
						$scope.data1.group4.items[i].Ui_Dependent_Nin = $scope.data1.group4.items[i].GCC_Dependent_Passport;
				}else
					$scope.data1.group4.items[i].Ui_Dependent_Nin = $scope.data1.group4.items[i].Dependent_Nin;
			}
			$scope.loadTab4();	
		},function(reason) {
			AlertService.error($scope);
		});
		
		$scope.loadTab4 = function(){
			DynamicPagesService.retrieveTabData(pageNo,600,$scope.nav.totalTabsCount,$scope.data,"/applicant-income/load").then(function(tabData) {
				if(tabData.group3.items.length > 0 || tabData.group12.items.length > 0 || !!tabData.group13.Employment_Status)
					$scope.Salary_Consent = true;
				$scope.data.group3.items = tabData.group3.items;
				$scope.data.group12.items = tabData.group12.items;
				$scope.data.group13 = tabData.group13;
				$scope.Beneficiary_Name = $scope.loggedInUser.name;
			},function(reason) {
				AlertService.error($scope);
			});
		}

		$scope.saveTabData = function() {
			var vlaidBeneficiaryIncome = $scope.validateBeneficiaryIncome();
			var vlaidDependentIncome = $scope.validateDependentIncome();
			
			if(!vlaidBeneficiaryIncome || !vlaidDependentIncome){
				$scope.preparErrorMsg();
				
				if (!!$scope.errorMessage) {
					AlertService.error($scope,$scope.errorMessage);
				} else {
					AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
				}
				$scope.errorMessage = null;
				$scope.showBeneficiaryErrorMsg1 = false;
				$scope.showBeneficiaryErrorMsg2 = false;
				$scope.showBeneficiaryErrorMsg3 = false;
				$scope.showBeneficiaryErrorMsg4 = false;
				$scope.showDependentErrorMsg1 = false;
				$scope.showDependentErrorMsg2 = false;
				$scope.showDependentErrorMsg3 = false;
				$scope.showDependentErrorMsg4 = false;
				return;
			}else
			
			var tabDataHasChanged = checkIfTabDataChanged($scope.nav.currentTabNumber,$scope.data, DynamicPagesService.getTabsDataArray());
			if (!tabDataHasChanged) {
				return;
			}
			
			$scope.saveInProgress = true;
			DynamicPagesService.saveTabData(pageNo,$scope.nav.currentTabNumber,$scope.data,"/applicant-income/save").then(function(data) {
				DynamicPagesService.setTabStatusToComplete(pageNo,$scope.nav.currentTabNumber);
				$scope.data = DynamicPagesService.processServerTabData(tabNo,data.value,$scope.data);
				$scope.saveInProgress = false;
				$scope.form.$submitted = false;
				AlertService.success($scope,"تم حفظ البيانات بنجاح");
				$scope.loadTab4();
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
		
		$scope.getEmploymentStatus = function(item){
			if(!!item){
				for(var i = 0 ; i < $scope.data1.group4.items.length ; i++){
					if(item == $scope.data1.group4.items[i].Dependent_Nin){
						$scope.dependentEmploymentStatus = $scope.data1.group4.items[i].Dependent_Employment_Status;
					}
				}
				$scope.data.group12.editableItem.data.Income_Type = null;
				$scope.data.group12.editableItem.data.Income_Source = null;
				$scope.data.group12.editableItem.data.Other_Income_Source = null;
				$scope.data.group12.editableItem.data.Monthly_Income = 0;
			}
		}
		
		$scope.validateBeneficiaryIncome = function(){
			var employmentStatus = $scope.data.group13.Employment_Status;
			
			if(null != employmentStatus){
				if(employmentStatus == "16001" || employmentStatus == "16003"){
					for(var i = 0 ; i < $scope.data.group3.items.length ; i++){
						if($scope.data.group3.items[i].Income_Source == "30001")
							return true;
					}
					$scope.showBeneficiaryErrorMsg1 = true;
				}
				if(employmentStatus == "16002" || employmentStatus == "16007"){
					for(var i = 0 ; i < $scope.data.group3.items.length ; i++){
						if($scope.data.group3.items[i].Income_Source == "30002")
							return true;
					}
					$scope.showBeneficiaryErrorMsg2 = true;
				}
				if(employmentStatus == "16006"){
					for(var i = 0 ; i < $scope.data.group3.items.length ; i++){
						if($scope.data.group3.items[i].Income_Source == "30003")
							return true;
					}
					$scope.showBeneficiaryErrorMsg3 = true;
				}
				if(employmentStatus == "16008"){
					for(var i = 0 ; i < $scope.data.group3.items.length ; i++){
						if($scope.data.group3.items[i].Income_Source == "30004" || $scope.data.group3.items[i].Income_Source == "30005" || $scope.data.group3.items[i].Income_Source == "30006" || 
								$scope.data.group3.items[i].Income_Source == "30007" || $scope.data.group3.items[i].Income_Source == "30008" || $scope.data.group3.items[i].Income_Source == "30009")
							return true;
					}
					$scope.showBeneficiaryErrorMsg4 = true;
				}
				if(employmentStatus == "16004" || employmentStatus == "16005" || employmentStatus == "16009" || employmentStatus == "16010" || employmentStatus == "16011")
					return true;
					
				$scope.BeneficiaryErrorIncomeName = $scope.loggedInUser.name;
				return false;
			}
			return false;
		}
		
		$scope.validateDependentIncome = function(){
			var employmentStatus = null;
			var flag = false
			var count = 0 ;
			$scope.dependentErrorArray = [];
			
			for(var i = 0 ; i < $scope.data1.group4.items.length ; i++){
				var errorDependent = new Object();
				employmentStatus = $scope.data1.group4.items[i].Dependent_Employment_Status;
				
				if(null != employmentStatus){
					if(employmentStatus == "16001" || employmentStatus == "16003"){
						flag = false;
						for(var k = 0 ; k < $scope.data.group12.items.length ; k++){
							if($scope.data.group12.items[k].Income_Source == "30001" && $scope.data.group12.items[k].Dependent_NIN == $scope.data1.group4.items[i].Dependent_Nin){
								count++;
								flag = true;
								break;
							}
						}
						if(!flag){
							$scope.showDependentErrorMsg1 = true;
							errorDependent.name = $scope.data1.group4.items[i].Dependent_First_Name + " " + $scope.data1.group4.items[i].Dependent_Father_Name + " " + $scope.data1.group4.items[i].Dependent_Grandfather_Name + " " + $scope.data1.group4.items[i].Dependent_Family_Name;
							errorDependent.errorType = 1;
							$scope.dependentErrorArray.push(errorDependent);
						}
					}
					if(employmentStatus == "16002" || employmentStatus == "16007"){
						flag = false;
						for(var l = 0 ; l < $scope.data.group12.items.length ; l++){
							if($scope.data.group12.items[l].Income_Source == "30002" && $scope.data.group12.items[l].Dependent_NIN == $scope.data1.group4.items[i].Dependent_Nin){
								count++;
								flag = true;
								break;
							}
						}
						if(!flag){
							$scope.showDependentErrorMsg2 = true;
							errorDependent.name = $scope.data1.group4.items[i].Dependent_First_Name + " " + $scope.data1.group4.items[i].Dependent_Father_Name + " " + $scope.data1.group4.items[i].Dependent_Grandfather_Name + " " + $scope.data1.group4.items[i].Dependent_Family_Name;
							errorDependent.errorType = 2;
							$scope.dependentErrorArray.push(errorDependent);
						}
					}
					if(employmentStatus == "16006"){
						flag = false;
						for(var j = 0 ; j < $scope.data.group12.items.length ; j++){
							if($scope.data.group12.items[j].Income_Source == "30003" && $scope.data.group12.items[j].Dependent_NIN == $scope.data1.group4.items[i].Dependent_Nin){
								count++;
								flag = true;
								break;
							}
						}
						if(!flag){
							$scope.showDependentErrorMsg3 = true;
							errorDependent.name = $scope.data1.group4.items[i].Dependent_First_Name + " " + $scope.data1.group4.items[i].Dependent_Father_Name + " " + $scope.data1.group4.items[i].Dependent_Grandfather_Name + " " + $scope.data1.group4.items[i].Dependent_Family_Name;
							errorDependent.errorType = 3;
							$scope.dependentErrorArray.push(errorDependent);
						}
					}
					if(employmentStatus == "16008"){
						flag = false;
						for(var s = 0 ; s < $scope.data.group12.items.length ; s++){
							if(($scope.data.group12.items[s].Income_Source == "30004" || $scope.data.group12.items[s].Income_Source == "30005" || $scope.data.group12.items[s].Income_Source == "30006" || 
									$scope.data.group12.items[s].Income_Source == "30007" || $scope.data.group12.items[s].Income_Source == "30008" || $scope.data.group12.items[s].Income_Source == "30009")
									&& $scope.data.group12.items[s].Dependent_NIN == $scope.data1.group4.items[i].Dependent_Nin){
								count++;
								flag = true;
								break;
							}
						}
						if(!flag){
							$scope.showDependentErrorMsg4 = true;
							errorDependent.name = $scope.data1.group4.items[i].Dependent_First_Name + " " + $scope.data1.group4.items[i].Dependent_Father_Name + " " + $scope.data1.group4.items[i].Dependent_Grandfather_Name + " " + $scope.data1.group4.items[i].Dependent_Family_Name;
							errorDependent.errorType = 4;
							$scope.dependentErrorArray.push(errorDependent);
						}
					}
					if(employmentStatus == "16004" || employmentStatus == "16005" || employmentStatus == "16009" || employmentStatus == "16010" || employmentStatus == "16011")
						count++
				}
			}
			if(count == $scope.data1.group4.items.length)
				return true;
			else
				return false;
		}
		
		$scope.preparErrorMsg = function(){
			if($scope.showBeneficiaryErrorMsg1){
				$scope.errorMessage = "الرجاء إدخال بيانات الدخل كراتب من القطاع الحكومي أو العسكري لـ: (" + $scope.BeneficiaryErrorIncomeName;
				if($scope.showDependentErrorMsg1){
					for(var i = 0 ; i < $scope.dependentErrorArray.length ; i++){
						if($scope.dependentErrorArray[i].errorType == 1)
							$scope.errorMessage += ", " + $scope.dependentErrorArray[i].name; 
					}
					$scope.errorMessage += ")"
				}else
					$scope.errorMessage += ")"
				return;
			}else if($scope.showDependentErrorMsg1){
				for(var i = 0 ; i < $scope.dependentErrorArray.length ; i++){
					if($scope.dependentErrorArray[i].errorType == 1){
						if(!$scope.errorMessage){
							$scope.errorMessage = "الرجاء إدخال بيانات الدخل كراتب من القطاع الحكومي أو العسكري لـ: ("
							$scope.errorMessage += $scope.dependentErrorArray[i].name;
						}else
							$scope.errorMessage += ", " + $scope.dependentErrorArray[i].name;
					}
				}
				$scope.errorMessage += ")"
				return;
			}
				
			if($scope.showBeneficiaryErrorMsg2){
				$scope.errorMessage = "الرجاء إدخال بيانات الدخل كراتب من القطاع الخاص لـ: (" + $scope.BeneficiaryErrorIncomeName;
				if($scope.showDependentErrorMsg2){
					for(var i = 0 ; i < $scope.dependentErrorArray.length ; i++){
						if($scope.dependentErrorArray[i].errorType == 2)
							$scope.errorMessage += ", " + $scope.dependentErrorArray[i].name; 
					}
					$scope.errorMessage += ")"
				}else
					$scope.errorMessage += ")"
				return;
			}else if($scope.showDependentErrorMsg2){
				for(var i = 0 ; i < $scope.dependentErrorArray.length ; i++){
					if($scope.dependentErrorArray[i].errorType == 2){
						if(!$scope.errorMessage){
							$scope.errorMessage = "الرجاء إدخال بيانات الدخل كراتب من القطاع الخاص لـ: ("
							$scope.errorMessage += $scope.dependentErrorArray[i].name;
						}else
							$scope.errorMessage += ", " + $scope.dependentErrorArray[i].name;
					}
				}
				$scope.errorMessage += ")"
				return;
			}
				
			if($scope.showBeneficiaryErrorMsg3){
				$scope.errorMessage = "الرجاء إدخال بيانات الدخل كراتب تقاعدي من القطاع الحكومي أو العسكري لـ: (" + $scope.BeneficiaryErrorIncomeName;
				if($scope.showDependentErrorMsg3){
					for(var i = 0 ; i < $scope.dependentErrorArray.length ; i++){
						if($scope.dependentErrorArray[i].errorType == 3)
							$scope.errorMessage += ", " + $scope.dependentErrorArray[i].name; 
					}
					$scope.errorMessage += ")"
				}else
					$scope.errorMessage += ")"
				return;
				
			}else if($scope.showDependentErrorMsg3){
				for(var i = 0 ; i < $scope.dependentErrorArray.length ; i++){
					if($scope.dependentErrorArray[i].errorType == 3){
						if(!$scope.errorMessage){
							$scope.errorMessage = "الرجاء إدخال بيانات الدخل كراتب تقاعدي من القطاع الحكومي أو العسكري لـ: ("
							$scope.errorMessage += $scope.dependentErrorArray[i].name;
						}else
							$scope.errorMessage += ", " + $scope.dependentErrorArray[i].name;
					}
				}
				$scope.errorMessage += ")"
				return;
			}
				
			if($scope.showBeneficiaryErrorMsg4){
				$scope.errorMessage = "الرجاء إدخال بيانات الدخل من المصادر التالية (حافز أو أي برنامج دعم حكومي أو ساند أو سجل تجاري أو رخصة محل تجاري أو غير ذلك) لـ: (" + $scope.BeneficiaryErrorIncomeName;
				if($scope.showDependentErrorMsg4){
					for(var i = 0 ; i < $scope.dependentErrorArray.length ; i++){
						if($scope.dependentErrorArray[i].errorType == 4)
							$scope.errorMessage += ", " + $scope.dependentErrorArray[i].name; 
					}
					$scope.errorMessage += ")"
				}else
					$scope.errorMessage += ")"
				return;
			}else if($scope.showDependentErrorMsg4){
				for(var i = 0 ; i < $scope.dependentErrorArray.length ; i++){
					if($scope.dependentErrorArray[i].errorType == 4){
						if(!$scope.errorMessage){
							$scope.errorMessage = "الرجاء إدخال بيانات الدخل من المصادر التالية (حافز أو أي برنامج دعم حكومي أو ساند أو سجل تجاري أو رخصة محل تجاري أو غير ذلك) لـ: ("
							$scope.errorMessage += $scope.dependentErrorArray[i].name;
						}else
							$scope.errorMessage += ", " + $scope.dependentErrorArray[i].name;
					}
				}
				$scope.errorMessage += ")"
				return;
			}
			
		}
		
		$scope.validateMonthlyIncome = function(employmentStatus,income,incomeSource){
		}
		
		$scope.resetBeneficiaryIncomeSource = function(){
			$scope.data.group3.editableItem.data.Income_Source = null;
			if($scope.data.group3.editableItem.data.Income_Type != "29004")
				$scope.data.group3.editableItem.data.Other_Income_Source = null
		}
		
		$scope.resetDependentIncomeSource = function(){
			$scope.data.group12.editableItem.data.Income_Source = null;
			if($scope.data.group12.editableItem.data.Income_Type != "29004")
				$scope.data.group12.editableItem.data.Other_Income_Source = null
		}
		
		$scope.resetBeneficiaryOtherIncomeSource = function(){
			if($scope.data.group3.editableItem.data.Income_Source != "30009"){
				$scope.data.group3.editableItem.data.Other_Income_Source = null;
			}
		}
		
		$scope.resetDependentOtherIncomeSource = function(){
			if($scope.data.group12.editableItem.data.Income_Source != "30009"){
				$scope.data.group12.editableItem.data.Other_Income_Source = null;
			}
		}
		
		$scope.calculateBeneficiaryIncome = function(newIncome , groupData , fromWhere){
			if($scope.data.group13.Employment_Status != "16001" && $scope.data.group13.Employment_Status != "16003"){
				if($scope.data.group3.editableItem.data.Income_Source == "30001" || 
						$scope.data.group3.editableItem.data.Income_Source == "30002" || 
						$scope.data.group3.editableItem.data.Income_Source == "30003" || 
						$scope.data.group3.editableItem.data.Income_Source == "30004" || 
						$scope.data.group3.editableItem.data.Income_Source == "30005" || 
						$scope.data.group3.editableItem.data.Income_Source == "30006" || 
						$scope.data.group3.editableItem.data.Income_Source == "30009"){
				}
			}else
				$scope.showIncomeErrorMessage = false;
			
			if(newIncome > $scope.cache.incomeApplicantMaximumAmount){
				$scope.incomeFromWhere = fromWhere;
				$("#beneficiary-income-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
					return (($(window).height() - $(this).height()) / 2) - 300;
				}});
			}else if(fromWhere == "Save"){
				$scope.addBeneficiaryIncome(groupData);
			}else if(fromWhere == "Edit"){
				$scope.applyBeneficiaryEditedIncome(groupData);
			}
		}
		
		$scope.saveBeneficiaryIncome = function(groupData){
			$("#beneficiary-income-modale").modal("hide");
			if($scope.data.group13.Employment_Status != "16001" && $scope.data.group13.Employment_Status != "16003"){
				if($scope.data.group3.editableItem.data.Income_Source == "30001" || 
						$scope.data.group3.editableItem.data.Income_Source == "30002" || 
						$scope.data.group3.editableItem.data.Income_Source == "30003" || 
						$scope.data.group3.editableItem.data.Income_Source == "30004" || 
						$scope.data.group3.editableItem.data.Income_Source == "30005" || 
						$scope.data.group3.editableItem.data.Income_Source == "30006" || 
						$scope.data.group3.editableItem.data.Income_Source == "30009"){
				}
			}else
				$scope.showIncomeErrorMessage = false;
			
			if($scope.incomeFromWhere == "Save")
				$scope.addBeneficiaryIncome(groupData);
			else if($scope.incomeFromWhere == "Edit")
				$scope.applyBeneficiaryEditedIncome(groupData);
		}
		
		$scope.calculateDependentIncome = function(newIncome , groupData , fromWhere){
			
			if($scope.dependentEmploymentStatus != "16001" && $scope.dependentEmploymentStatus != "16003"){
				if($scope.data.group12.editableItem.data.Income_Source == "30001" || 
						$scope.data.group12.editableItem.data.Income_Source == "30002" || 
						$scope.data.group12.editableItem.data.Income_Source == "30003" || 
						$scope.data.group12.editableItem.data.Income_Source == "30004" || 
						$scope.data.group12.editableItem.data.Income_Source == "30005" || 
						$scope.data.group12.editableItem.data.Income_Source == "30006" || 
						$scope.data.group12.editableItem.data.Income_Source == "30009"){
				}
			}else
				$scope.showIncomeErrorMessage = false;
			
				
			if(newIncome > $scope.cache.incomeApplicantMaximumAmount){
				$scope.incomeFromWhere = fromWhere;
				$("#dependent-income-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
					return (($(window).height() - $(this).height()) / 2) - 300;
				}});
			}else if(fromWhere == "Save"){
				$scope.addDependentIncome(groupData);
			}else if(fromWhere == "Edit"){
				$scope.applyDependentEditedIncome(groupData);
			}
		}
		
		$scope.saveDependentIncome = function(groupData){
			$("#dependent-income-modale").modal("hide");
			if($scope.dependentEmploymentStatus != "16001" && $scope.dependentEmploymentStatus != "16003"){
				if($scope.data.group12.editableItem.data.Income_Source == "30001" || 
						$scope.data.group12.editableItem.data.Income_Source == "30002" || 
						$scope.data.group12.editableItem.data.Income_Source == "30003" || 
						$scope.data.group12.editableItem.data.Income_Source == "30004" || 
						$scope.data.group12.editableItem.data.Income_Source == "30005" || 
						$scope.data.group12.editableItem.data.Income_Source == "30006" || 
						$scope.data.group12.editableItem.data.Income_Source == "30009"){
				}
			}else
				$scope.showIncomeErrorMessage = false;
			
			if($scope.incomeFromWhere == "Save")
				$scope.addDependentIncome(groupData);
			else if($scope.incomeFromWhere == "Edit")
				$scope.applyDependentEditedIncome(groupData);
		}

		$scope.addBeneficiaryIncome = function(groupData){
			$scope.Beneficiary_Name = $scope.loggedInUser.name;
			groupData.editableItem.data.Income_Reference_Number = groupData.items.length;
			$scope.addNewItemToItemsList(groupData);
		}
		
		$scope.addDependentIncome = function(groupData){
			groupData.editableItem.data.Income_Reference_Number = groupData.items.length;
			$scope.addNewItemToItemsList(groupData);
		}
		
		$scope.applyBeneficiaryEditedIncome = function(groupData){
			$scope.applyEdit(groupData);
		}
		
		$scope.applyDependentEditedIncome = function(groupData){
			$scope.applyEdit(groupData);
		}
		
	} ]);
dynamicPagesControllers.controller("DocumentManagementController",["$scope","$rootScope","$http","$routeParams","$location","DynamicPagesService","AlertService","API_ROOT_URL","$filter","ApplicationService","FileUploader",
	function($scope, $rootScope, $http, $routeParams,$location, DynamicPagesService, AlertService,API_ROOT_URL, $filter,ApplicationService, FileUploader) {
	var pageNo = 200;
	var tabNo = 700;
	
	preventSkippingIncompleteTab(pageNo, tabNo,"application", DynamicPagesService,$location);
	$scope.saveInProgress = false;
	$scope.toggleArrayItem = toggleArrayItem;
	$scope.queueLength = 0;
	$scope.aboutToExpiredUploaderQueueLength = 0;
	$scope.dropDownNins = [];
	$scope.uploadedFiles = [];
	$scope.aboutToExpiredUploadedFiles = [];
	$scope.deletedFiles = [];
	$scope.showNoFileMessage = false;
	$scope.noFileFlag = false;
	$scope.disableRemove = false;
	$scope.requiredDocument = true;
	$scope.disableSentence_End_Date = false;
	$scope.documentArray = [];
	$scope.aboutExpierdInfoList = [];
	$scope.numberOfAllowedDcouments = 4;
	$scope.showMarriedMsg = false;
	$scope.nav = {
		showPreviousBtn : true,
		showNextBtn : true,
		showSubmitBtn : false,
		currentTabNumber : tabNo,
		totalTabsCount : 8,
		previousFunction : function(){
			$location.path('/application/6');
		},
		nextFunction : function() {
			
			$scope.isAboutExpierdDocumentValid = true;
			
			if ($scope.fileData.docCategory != null && $scope.fileData.docCategory != "0") {
				$scope.showAttachmentMsg = true;
				return;
			}
			
			if($scope.deletedFiles.length > 0 && $scope.queueLength == 0){
				if($scope.hohQueueSize > $scope.queueLength){
					$scope.showAttachmentMsg = true;
					return;
				}
			}
			
			if (!$scope.validateDocument()) {
				$scope.showAttachmentMsg = true;
				return;
			}
			
			if ($scope.uploader.queue.length == 0) {
				if($scope.deletedFiles.length > 0){
					$scope.deleteFilesAndNext();
				}else{
					ApplicationService.completeWithoutDocuments().then(function(data) {
						$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 700, $scope.cache.enums.ApplicantWizardTabStatus.COMPLETE)	
						AlertService.roamingAlert('success','تم حفظ البيانات بنجاح');
						$location.path('/application/8');
						return;
					},function(data){
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
			}else{
				$scope.fromWhere = "next";
				$("#attachment-confirmation-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
					return (($(window).height() - $(this).height()) / 2) - 300;
				}});
			}
		}
	};
	
	$scope.data = {
	}
	
	$scope.tab3Data = {
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
					Dependent_Document_By_Pass_Status : null,
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
					Dependent_Document_By_Pass_Status : null,
					transaction_type : 1
				}
			},
			items : [],
			removedItems : [],
			showAddForm : false
		},
		group11 : {
			HoH_Category : null,
			Applicant_Document_By_Pass_Status : null
		}
	}
	
	$scope.fileData = {
			docHDateOfBirth : {
				day : null,
				month : null,
				year : null
			},
			docGDateOfBirth : {
				day : null,
				month : null,
				year : null
			},
			docIssueDate : {
				day : null,
				month : null,
				year : null
			},
			docStartDate : {
				day : null,
				month : null,
				year : null
			},
			docEndDate : {
				day : null,
				month : null,
				year : null
			},
			docValidityPeriod : null,
			docNumber : null,
			docNin : null,
			docCategory : null,
			accountNumber : null,
			isNew : 1,
			selectedNins : []
		}
	
	$scope.aboutExpierdFileData = {
			docHDateOfBirth : {
				day : null,
				month : null,
				year : null
			},
			docGDateOfBirth : {
				day : null,
				month : null,
				year : null
			},
			docIssueDate : {
				day : null,
				month : null,
				year : null
			},
			docStartDate : {
				day : null,
				month : null,
				year : null
			},
			docEndDate : {
				day : null,
				month : null,
				year : null
			},
			docValidityPeriod : null,
			docNumber : null,
			docNin : null,
			docCategory : null,
			accountNumber : null,
			isNew : 0,
			selectedNins : [],
			docId : null
		}
	
	$scope.saveTabData = function(){
		
		$scope.isAboutExpierdDocumentValid = true;
		
		if ($scope.fileData.docCategory != null && $scope.fileData.docCategory != "0") {
			$scope.showAttachmentMsg = true;
			return;
		}
		
		if($scope.deletedFiles > 0 && $scope.queueLength == 0){
			if($scope.hohQueueSize > $scope.queueLength){
				$scope.showAttachmentMsg = true;
				return;
			}
		}
		
		if (!$scope.validateDocument()) {
			$scope.showAttachmentMsg = true;
			return;
		}
		
		if ($scope.uploader.queue.length == 0) {
			if($scope.deletedFiles.length > 0){
				$scope.deleteFilesAndSave();
			}else{
				ApplicationService.completeWithoutDocuments().then(function(data) {
					$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 700, $scope.cache.enums.ApplicantWizardTabStatus.COMPLETE)	
					AlertService.success($scope,"تم حفظ البيانات بنجاح");
					return;
				},function(data){
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
		}else{
			$scope.fromWhere = "save";
			$("#attachment-confirmation-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
				return (($(window).height() - $(this).height()) / 2) - 300;
			}});
		}
	}
	
	ApplicationService.loadDependentAndHOH().then(function(tabData3) {
			$scope.tabData3 = tabData3.data;
			$scope.tabData3.group11.HoH_Category = parseInt($scope.tabData3.group11.HoH_Category);
			$scope.showHohCategory = false;
			for(var i = 0 ; i < $scope.tabData3.group4.items.length ; i++){
				var DependentObject = new Object();
				DependentObject.id = $scope.tabData3.group4.items[i].Dependent_Nin;
				DependentObject.label = $scope.tabData3.group4.items[i].Dependent_Nin + " - " 
				+ $scope.tabData3.group4.items[i].Dependent_First_Name + " " + $scope.tabData3.group4.items[i].Dependent_Father_Name 
				+ " " + $scope.tabData3.group4.items[i].Dependent_Grandfather_Name + " " + $scope.tabData3.group4.items[i].Dependent_Family_Name;
				
				$scope.dropDownNins.push(DependentObject);
			}
			var applicant = new Object();
			applicant.id = $scope.loggedInUser.nin;
			applicant.label = $scope.loggedInUser.nin + " - " + $scope.loggedInUser.name;
			$scope.dropDownNins.push(applicant);
			
			for(var i = 0 ; i < $scope.tabData3.group4.items.length ; i++){
				if ($scope.tabData3.group4.items[i].Dependent_Relationship == $scope.cache.enums.Relationship.SPONSORED_DEPENDENT
						|| $scope.tabData3.group4.items[i].Dependent_Relationship == $scope.cache.enums.Relationship.SISTER
						|| $scope.tabData3.group4.items[i].Dependent_Relationship == $scope.cache.enums.Relationship.BROTHER
						|| $scope.tabData3.group4.items[i].Dependent_Relationship == $scope.cache.enums.Relationship.FATHER
						|| $scope.tabData3.group4.items[i].Dependent_Relationship == $scope.cache.enums.Relationship.MOTHER) {
					$scope.showHohCategory = true;
				}
			}
			$scope.getUploadedFiles();
			$scope.isDocumentRequired();
			
	}, function(reason) {
			AlertService.error($scope);
		});
	
	function checkPUD(){
		$scope.disableAttachmentUpload = true;
		$scope.showMarriedMsg = false;
		$scope.isAppliantOrDependentPUD = false;
		if(!!$rootScope.applicantEligibilityInfo && !!$rootScope.applicantDependentsEligibilityInfo){
			if($rootScope.applicantEligibilityInfo.eligibilityStatus == 0 || $rootScope.applicantEligibilityInfo.eligibilityStatus == 2){
				$scope.numberOfAllowedDcouments = $scope.numberOfAllowedDcouments + 2;
				$scope.isAppliantOrDependentPUD = true;
				$scope.insertInfo();
				if($scope.tabData3.group11.HoH_Category == 36 || $scope.tabData3.group11.HoH_Category == 360)
					$scope.showMarriedMsg = true;
			}
			for(var i = 0 ; i < $scope.tabData3.group4.items.length ; i++){
				for(var j = 0 ; j < $rootScope.applicantDependentsEligibilityInfo.length ; j++){
					if($scope.tabData3.group4.items[i].Dependent_Nin == $rootScope.applicantDependentsEligibilityInfo[j].dependentNin && 
							($rootScope.applicantDependentsEligibilityInfo[j].eligibilitySatus == 0 || $rootScope.applicantDependentsEligibilityInfo[j].eligibilitySatus == 2) ){
						$scope.numberOfAllowedDcouments++;
						$scope.isAppliantOrDependentPUD = true;
					}
				}
			}
				$scope.disableAttachmentUpload = $scope.showNoFileMessage;
		}else
			$scope.disableAttachmentUpload = $scope.showNoFileMessage;
	}
	
	$scope.getUploadedFiles = function() {
		ApplicationService.getUploadedFiles().success(function(data) {
			$scope.numberOfAllowedDcouments = 4;
			$scope.documentArray = [];
			$scope.uploadedFiles = [];
			$scope.aboutToExpiredUploadedFiles = [];
			if (data.value.length > 0) {
				$scope.noFileFlag = false;
				for (var i = 0; i < data.value.length; i++) {
					$scope.addType(data.value[i].category.toString(), null, "new");
					data.value[i].isSuccess = true;
					data.value[i].progress = 100;
					data.value[i].statusCode = data.value[i].status;
					data.value[i].status = $scope.getStatus(data.value[i].status);
					data.value[i].stringCategory = $scope.type;
					switch(data.value[i].statusCode){
					case $scope.cache.enums.DocumentStatus.WAITING_APPROVAL:
						$scope.noFileFlag = true;
						break;
					case $scope.cache.enums.DocumentStatus.ABOUT_TO_EXPIRED:
						var document = new Object();
						document.Key = data.value[i].category;
						document.Value = data.value[i].stringCategory + " - " + data.value[i].fileName;
						document.id = data.value[i].id;
						$scope.documentArray.push(document);
						break;
					}
				}
				for(var i = 0 ; i < $scope.documentArray.length ; i++){
					$scope.aboutExpierdInfoList.push($scope.documentArray[i].Value);
				}
				for(var i = 0 ; i < data.value.length; i++){
					if(data.value[i].isNew == 1){
						$scope.uploadedFiles.push(data.value[i]);
					}else 
						$scope.aboutToExpiredUploadedFiles.push(data.value[i]);
				}
				$scope.uploadedFiles = $scope.checkDocumentForRemove($scope.uploadedFiles);
				$scope.queueLength = $scope.uploadedFiles.length;
				$scope.aboutToExpiredUploaderQueueLength = $scope.aboutToExpiredUploadedFiles.length;
				if(!!$scope.loggedInUser.profileStatus){
					if($scope.loggedInUser.profileStatus == $scope.cache.enums.ProfileStatus.COMPLETE && $scope.noFileFlag){
						$scope.showNoFileMessage = true;
						$scope.insertInfo();
					}else{
						$scope.showNoFileMessage = false;
					}
				}
			} else {
				$scope.insertInfo();
			}
			checkPUD();
		});
	}
	
	
	$scope.isDocumentRequired = function(){
		ApplicationService.isRequiredDocument().then(function(data) {
			$scope.requiredDocument = data.data.value;
			$scope.insertInfo();    
		}, function(data){
			AlertService.error($scope);
		});
	}
	$scope.checkDocumentForRemove = function(uploadedFiles){
		if($scope.loggedInUser.profileStatus == $scope.cache.enums.ProfileStatus.COMPLETE){
			for(var i = 0 ; i < uploadedFiles.length ; i++){
				if(uploadedFiles[i].status == "تحت الإجراء"){
					uploadedFiles[i].disableRemove = true;
				}else{
					uploadedFiles[i].disableRemove = false;
				}
			}
		}else{
			for(var i = 0 ; i < uploadedFiles.length ; i++){
				uploadedFiles[i].disableRemove = false;
			}
		}
		return uploadedFiles;
	}
	
	$scope.disableSentenceEndDate = function(){
		$scope.fileData.docEndDate = null;
		$scope.disableSentence_End_Date = !$scope.disableSentence_End_Date;
	}
	
	
	$scope.getStatus = function(status) {
		switch (status) {
		case $scope.cache.enums.DocumentStatus.WAITING_APPROVAL:
			return "تحت الإجراء"
			break;
		case $scope.cache.enums.DocumentStatus.APPROVED:
			return "تمت الموافقة"
			break;
		case $scope.cache.enums.DocumentStatus.REJECTED:
			return "تم الرفض"
			break;
		case $scope.cache.enums.DocumentStatus.EXPIRED:
			return "وثيقة منتهية"
			break;
		case $scope.cache.enums.DocumentStatus.ABOUT_TO_EXPIRED:
			return "وثيقة شارفة على الإنتهاء"
			break;
		case $scope.cache.enums.DocumentStatus.INFECTED:
			return "تم الرفض"
			break;
		default:
			return "";
		}
	}
	
	$scope.dropDownSettings = { 
			smartButtonMaxItems: 1 , smartButtonTextConverter: function(itemText, originalItem) { 
			return itemText; } 
	};
	
	$scope.deleteFile = function(item){
		$scope.deletedFiles.push(item.id);
		for(var i = 0 ; i < $scope.uploadedFiles.length ; i++){
			if($scope.uploadedFiles[i].id == item.id){
				$scope.uploadedFiles.splice(i, 1);
			}
		}
		$scope.queueLength = $scope.uploader.queue.length + $scope.uploadedFiles.length;
	}
	
	$scope.addType = function(type , documentId, fromWhere) {
		if(!type && documentId != "0"){
			for(var i = 0 ; i < $scope.documentArray.length ; i++){
				if($scope.documentArray[i].id == documentId){
					type = $scope.documentArray[i].Key;
					$scope.aboutExpierdFileData.docCategory = $scope.documentArray[i].Key;
				} 
			}
		}
		if (type == 0) {
			$scope.showAttachmentMsg = false;
		}
		if(!type)
			$scope.aboutExpierdFileData.docCategory = "0";
		
		if(fromWhere == "aboutExpierd"){
			$scope.fileData.docCategory = null;
		}else
			$scope.aboutExpierdFileData.docCategory = null;
		
		$scope.EmptyFileds();
		$scope.EmptyAboutToExpiredFileds()
		$scope.group8Form.$setUntouched();
		$scope.fileTypeError = false;
		switch (type) {
		case "23001":
			$scope.type = "صك إعالة";
			break;
		case "23002":
			$scope.type = "صك الولاية";
			break;
		case "23003":
			$scope.type = "إثبات الاحتضان";
			break;
		case "23004":
			$scope.type = "صك شرعي بعدم الأهلية";
			break;
		case "23005":
			$scope.type = "عقد الايجار";
			break;
		case "23006":
			$scope.type = "صك الملكية";
			break;
		case "23007":
			$scope.type = "عقد ايجار العائلة";
			break;
		case "23008":
			$scope.type = "صك ملكية العائلة";
			break;
		case "23009":
			$scope.type = "مستند من المستشفى توضح الحالة المرضية";
			break;
		case "23010":
			$scope.type = "مستند من السجن";
			break;
		case "23011":
			$scope.type = "محضر تبليغ من الشرطة";
			break;
		case "23012":
			$scope.type = "صك شرعي بالغياب او الفقد";
			break;
		case "23014":
			$scope.type = "خطاب الموافقة الاساسية من وزارة الداخلية";
			break;
		case "23015":
			$scope.type = "شريحة حديثة من الاحوال المدنية تثبت زواجها من أجنبي";
			break;
		case "23016":
			$scope.type = "فاتورة الكهرباء";
			break;
		case "23017":
			$scope.type = "فاتورة كهرباء العائلة";
			break;
		default:
			$scope.type = "";
		}
	}
	
	$scope.EmptyFileds = function() {
		$scope.fileData.docHDateOfBirth = null;
		$scope.fileData.docGDateOfBirth = null;
		$scope.fileData.docIssueDate = null;
		$scope.fileData.docStartDate = null;
		$scope.fileData.docEndDate = null;
		$scope.fileData.docValidityPeriod = null;
		$scope.fileData.docNumber = null;
		$scope.fileData.docNin = null;
		$scope.fileData.accountNumber = null;
		$scope.fileData.selectedNins = [];
		$scope.disableSentence_End_Date = false;
	}
	
	$scope.insertInfo = function() {
		var hohCategory = $scope.tabData3.group11.HoH_Category;
		hohCategory = parseInt(hohCategory);
		$scope.infoList = new Array();
		$scope.hohQueueSize = 0;
		$scope.validateFunction1 = false;
		$scope.validateFunction2 = false;
		$scope.validateFunction3 = false;
		$scope.validateFunction4 = false;
		$scope.validateFunction5 = false;
		$scope.validateFunction7 = false;
		$scope.isDocumentRequired = true;
		if(!$scope.isAppliantOrDependentPUD){
			if($scope.requiredDocument != 2 && $scope.requiredDocument != 3)
				$scope.isDocumentRequired = false;
		}
		if (hohCategory) {
			if ((hohCategory == 12 || hohCategory == 120 || hohCategory == 13
					|| hohCategory == 31 || hohCategory == 310
					|| hohCategory == 32 || hohCategory == 320) && ($scope.isDocumentRequired) ) {
				$scope.infoList
						.push("صك ولاية أو صك إعالة أو إثبات الإحتضان");
				$scope.validateFunction1 = true;
				$scope.hohQueueSize++;
			}
			if (hohCategory == 41 && ($scope.isDocumentRequired)) {
				$scope.infoList
						.push("صك شرعي بعدم الأهلية أو مستند من المستشفى توضح الحالة المرضية");
				$scope.validateFunction2 = true;
				$scope.hohQueueSize++;
			}
			if ((hohCategory == 11 || hohCategory == 110) && ($scope.isDocumentRequired)) {
				$scope.infoList
						.push("صك الملكية أو عقد الإيجار أو فاتورة الكهرباء");
				$scope.infoList
						.push("صك ملكية العائلة أو عقد إيجار العائلة أو فاتورة كهرباء العائلة");
				$scope.validateFunction3 = true;
				$scope.hohQueueSize++;
				$scope.hohQueueSize++;
			}
			if (hohCategory == 42 && ($scope.isDocumentRequired)) {
				$scope.infoList.push("مستند من السجن");
				$scope.validateFunction4 = true;
				$scope.hohQueueSize++;
			}
			if (hohCategory == 33 && ($scope.isDocumentRequired)) {
				$scope.infoList
						.push("محضر تبليغ من الشرطة أو صك شرعي بالغياب او الفقد");
				$scope.validateFunction5 = true;
				$scope.hohQueueSize++;
			}
			if (hohCategory == 35 && ($scope.isDocumentRequired)) {
				$scope.infoList
						.push("خطاب الموافقة الأساسية من وزارة الداخلية");
				$scope.infoList
						.push("شريحة حديثة من الأحوال المدنية تثبت زواجها من أجنبي");
				$scope.validateFunction7 = true;
				$scope.hohQueueSize++;
				$scope.hohQueueSize++;
			}
			if ($scope.showHohCategory && $scope.infoList[0] != "صك ولاية أو صك إعالة أو إثبات الإحتضان" && ($scope.isDocumentRequired)) {
				$scope.infoList.push("صك ولاية أو صك إعالة أو إثبات الإحتضان");
				$scope.validateFunction1 = true;
				$scope.hohQueueSize++;
			} else if ($scope.showHohCategory && $scope.infoList.length == 0 && ($scope.isDocumentRequired)) {
				$scope.infoList.push("صك ولاية أو صك إعالة أو إثبات الإحتضان");
				$scope.validateFunction1 = true;
				$scope.hohQueueSize++;
			}
			
		}
		if($scope.infoList.length == 0){
			$scope.infoList.push("لا يوجد مرفقات مطلوبة");
		}
	}
	
	// Validate added document
	
	$scope.validateDocument = function(){
		var validDocuments = true;
		if($scope.hohQueueSize <= $scope.queueLength){
			if($scope.validateFunction1)
				$scope.valid1 = $scope.validate1();
			if($scope.validateFunction2)
				$scope.valid2 = $scope.validate2();
			if($scope.validateFunction3)
				$scope.valid3 = $scope.validate3();
			if($scope.validateFunction4)
				$scope.valid4 = $scope.validate4();
			if($scope.validateFunction5)
				$scope.valid5 = $scope.validate5();
			if($scope.validateFunction7)
				$scope.valid7 = $scope.validate7();
		}else
			return false
			
		var validArr = $scope.getValids();
		
		for(var i = 0 ; i < validArr.length ; i++){
			if(!validArr[i])
				validDocuments = false;
		}
			
		if(validDocuments)
			return true;
		else
			return false;
	}
	
	$scope.getValids = function(){
		var valids = [];
		
		if($scope.validateFunction1)
			valids.push($scope.valid1);
		if($scope.validateFunction2)
			valids.push($scope.valid2);
		if($scope.validateFunction3)
			valids.push($scope.valid3);
		if($scope.validateFunction4)
			valids.push($scope.valid4);
		if($scope.validateFunction5)
			valids.push($scope.valid5);
		if($scope.validateFunction7)
			valids.push($scope.valid7);
		
		return valids;
	}
	
	$scope.validate1 = function(){
		for(var i = 0 ; i < $scope.uploader.queue.length ; i++){
			if($scope.uploader.queue[i].formData[0].docCategory == "23001" ||
					$scope.uploader.queue[i].formData[0].docCategory == "23002" ||
						$scope.uploader.queue[i].formData[0].docCategory == "23003"){
				return true;
			}
		}
		for(var i = 0 ; i < $scope.uploadedFiles.length ; i++){
			if($scope.uploadedFiles[i].category == "23001" ||
					$scope.uploadedFiles[i].category == "23002" ||
						$scope.uploadedFiles[i].category == "23003"){
				return true;
			}
		}
		return false;
	}
	
	$scope.validate2 = function(){
		for(var i = 0 ; i < $scope.uploader.queue.length ; i++){
			if($scope.uploader.queue[i].formData[0].docCategory == "23004" ||
					$scope.uploader.queue[i].formData[0].docCategory == "23009"){
				return true;
			}
		}
		for(var i = 0 ; i < $scope.uploadedFiles.length ; i++){
			if($scope.uploadedFiles[i].category == "23004" ||
					$scope.uploadedFiles[i].category == "23009"){
				return true;
			}
		}
		return false;
	}
	
	$scope.validate3 = function(){
		var validDocument1 = false;
		var validDocument2 = false;
		for(var i = 0 ; i < $scope.uploader.queue.length ; i++){
			if($scope.uploader.queue[i].formData[0].docCategory == "23005" ||
					$scope.uploader.queue[i].formData[0].docCategory == "23006" ||
						$scope.uploader.queue[i].formData[0].docCategory == "23016"){
				validDocument1 = true;
				break;
			}
		}
		if(!validDocument1){
			for(var i = 0 ; i < $scope.uploadedFiles.length ; i++){
				if($scope.uploadedFiles[i].category == "23005" ||
						$scope.uploadedFiles[i].category == "23006" ||
							$scope.uploadedFiles[i].category == "23016"){
					validDocument1 = true;
					break;
				}
			}
		}
		for(var k = 0 ; k < $scope.uploader.queue.length ; k++){
			if($scope.uploader.queue[k].formData[0].docCategory == "23007" ||
					$scope.uploader.queue[k].formData[0].docCategory == "23008" || 
						$scope.uploader.queue[k].formData[0].docCategory == "23017" ){
				validDocument2 = true;
				break;
			}
		}
		if(!validDocument2){
			for(var k = 0 ; k < $scope.uploadedFiles.length ; k++){
				if($scope.uploadedFiles[k].category == "23007" ||
						$scope.uploadedFiles[k].category == "23008" ||
							$scope.uploadedFiles[k].category == "23017"){
					validDocument2 = true;
					break;
				}
			}
		}
		return (validDocument1 && validDocument2);
	}
	
	$scope.validate4 = function(){
		for(var i = 0 ; i < $scope.uploader.queue.length ; i++){
			if($scope.uploader.queue[i].formData[0].docCategory == "23010"){
				return true;
			}
		}
		for(var i = 0 ; i < $scope.uploadedFiles.length ; i++){
			if($scope.uploadedFiles[i].category == "23010"){
				return true;
			}
		}
		return false;
	}
	
	$scope.validate5 = function(){
		for(var i = 0 ; i < $scope.uploader.queue.length ; i++){
			if($scope.uploader.queue[i].formData[0].docCategory == "23011" ||
					$scope.uploader.queue[i].formData[0].docCategory == "23012"){
				return true;
			}
		}
		for(var i = 0 ; i < $scope.uploadedFiles.length ; i++){
			if($scope.uploadedFiles[i].category == "23011" ||
					$scope.uploadedFiles[i].category == "23012"){
				return true;
			}
		}
		return false;
	}
	
	$scope.validate7 = function(){
		validDocument1 = false;
		validDocument2 = false;
		for(var i = 0 ; i < $scope.uploader.queue.length ; i++){
			if($scope.uploader.queue[i].formData[0].docCategory == "23014"){
				validDocument1 = true;
				break;
			}
		}
		if(!validDocument1){
			for(var i = 0 ; i < $scope.uploadedFiles.length ; i++){
				if($scope.uploadedFiles[i].category == "23014"){
					validDocument1 = true;
					break;
				}
			}
		}
		for(var k = 0 ; k < $scope.uploader.queue.length ; k++){
			if($scope.uploader.queue[k].formData[0].docCategory == "23015"){
				validDocument2 = true;
				break;
			}
		}
		if(!validDocument2){
			for(var k = 0 ; k < $scope.uploadedFiles.length ; k++){
				if($scope.uploadedFiles[k].category == "23015"){
					validDocument2 = true;
					break;
				}
			}
		}
		return (validDocument1 && validDocument2);
	}
	
	$scope.showResultMessage = function(){
		if(!$scope.uploadCompleted && $scope.showInfectedMessage){
			AlertService.error($scope,"لا يمكن القيام برفع المرفقات نظرا لاحتوائها على محتويات غير آمنة")
			$scope.saveInProgress = false;
			$scope.form.$submitted = false;
			return;
		}else if(!$scope.uploadCompleted && !$scope.showInfectedMessage){
			AlertService.error($scope,"حدث خطأ أثناء رفع مرفقات التابعين, الرجاء معاودة رفع المرفقات")
			$scope.saveInProgress = false;
			$scope.form.$submitted = false;
			return;
		}else if($scope.uploadCompleted && $scope.fromWhere == "save"){
				$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 700, $scope.cache.enums.ApplicantWizardTabStatus.COMPLETE)
				AlertService.success($scope,"تم حفظ البيانات بنجاح");
				$scope.uploader.queue = [];
				$scope.getUploadedFiles();
				$scope.saveInProgress = false;
				$scope.form.$submitted = false;
				return;
		}else if($scope.uploadCompleted && $scope.fromWhere == "next"){
				$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 700, $scope.cache.enums.ApplicantWizardTabStatus.COMPLETE)
				$location.path('/application/8');
				AlertService.roamingAlert('success','تم حفظ البيانات بنجاح');
				$scope.saveInProgress = false;
				$scope.form.$submitted = false;
				return;
		}else{
			AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
			$scope.saveInProgress = false;
			$scope.form.$submitted = false;
			return;
		}
	}
	
	$scope.deleteFilesAndSave = function(){
		ApplicationService.deleteFiles($scope.deletedFiles).then(function(data){
			if(data.data.code == 0){
				$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 700, $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE)
				$scope.deletedFiles = [];
				if($scope.uploader.queue.length > 0){
					$scope.uploader.uploadAll();
				}else{
					$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 700, $scope.cache.enums.ApplicantWizardTabStatus.COMPLETE)
					AlertService.success($scope,
					"تم حفظ البيانات بنجاح");
					$scope.uploader.queue = [];
					$scope.getUploadedFiles();
					$scope.saveInProgress = false;
					$scope.form.$submitted = false;
					return;
				}
			}else{
				var defaultErrorMessage = "لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً";
				if (!!data.data.message) {
					AlertService.error($scope,data.data.message);
				} else if (!!defaultErrorMessage) {
					AlertService.error($scope,defaultErrorMessage);
				} else {
					AlertService.error($scope);
				}
			}
		});
	}
	
	$scope.deleteFilesAndNext = function(){
		ApplicationService.deleteFiles($scope.deletedFiles).then(function(data){
			if(data.data.code == 0){
				$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 700, $scope.cache.enums.ApplicantWizardTabStatus.INCOMPLETE)
				$scope.deletedFiles = [];
				if($scope.uploader.queue.length > 0){
					$scope.uploader.uploadAll();
				}else{
					$scope.loggedInUser.wizardProgressInfo.setTabStatus(200, 700, $scope.cache.enums.ApplicantWizardTabStatus.COMPLETE)
					$location.path('/application/8');
					AlertService.roamingAlert('success',
							'تم حفظ البيانات بنجاح');
					$scope.saveInProgress = false;
					$scope.form.$submitted = false;
					return;
				}
			}else{
				var defaultErrorMessage = "لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً";
				if (!!data.data.message) {
					AlertService.error($scope,data.data.message);
				} else if (!!defaultErrorMessage) {
					AlertService.error($scope,defaultErrorMessage);
				} else {
					AlertService.error($scope);
				}
			}
		});
	}
	
	$scope.reduceQueueLength = function(){
		$scope.queueLength = $scope.queueLength - 1 ;
	}
	
	$scope.reduceAboutToExpiredQueueLength = function(){
		$scope.aboutToExpiredUploaderQueueLength = $scope.aboutToExpiredUploaderQueueLength - 1 ;
		$scope.fileTypeError = false;
	}
	
	// Uploader functions
	
	var uploader = $scope.uploader = new FileUploader({
		url : API_ROOT_URL + "/document"
//		queueLimit : $scope.numberOfAllowedDcouments

	});

	uploader.filters
			.push({
				name : 'fileFilter',
				fn : function(item, options) {
					var type = '|'
							+ item.type
									.slice(item.type
											.lastIndexOf('/') + 1)
							+ '|';
					if (type && type.length > 0)
						type = type.toLowerCase();
					if ('|jpg|png|jpeg|bmp|pdf|'
							.indexOf(type) === -1){
						$scope.group8Form.fileTypeError =  true;
						return false;
					}
						
					if (item.size > 2000000){
						$scope.group8Form.fileTypeError =  true;
						return false;
					}
						
					$scope.fileTypeError = false;
					return true;
				}
			});
	
	uploader.onAfterAddingFile = function(item) {
		$scope.queueLength = $scope.uploader.queue.length + $scope.uploadedFiles.length;
		var ninsArray = [];
		if ($scope.queueLength <= $scope.numberOfAllowedDcouments) {
			$scope.showQueueErrorMessage = false;
			item.fileType = $scope.type;
			var uploadData = new Object();
			if (null != $scope.fileData.docIssueDate)
				uploadData.docIssueDate = $scope.fileData.docIssueDate.day
						+ $scope.fileData.docIssueDate.month
						+ $scope.fileData.docIssueDate.year;
			if (null != $scope.fileData.docHDateOfBirth)
				uploadData.docHDateOfBirth = $scope.fileData.docHDateOfBirth.day
						+ $scope.fileData.docHDateOfBirth.month
						+ $scope.fileData.docHDateOfBirth.year;
			if (null != $scope.fileData.docGDateOfBirth)
				uploadData.docGDateOfBirth = $scope.fileData.docGDateOfBirth.day
						+ $scope.fileData.docGDateOfBirth.month
						+ $scope.fileData.docGDateOfBirth.year;
			if (null != $scope.fileData.docStartDate)
				uploadData.docStartDate = $scope.fileData.docStartDate.day
						+ $scope.fileData.docStartDate.month
						+ $scope.fileData.docStartDate.year;
			if (!$scope.disableSentence_End_Date){
				if(null != $scope.fileData.docEndDate)
				uploadData.docEndDate = $scope.fileData.docEndDate.day
						+ $scope.fileData.docEndDate.month
						+ $scope.fileData.docEndDate.year;
			}
			if($scope.uploadedFiles.length == 0 && $scope.deletedFiles.length == 0)
				uploadData.isNew = true;
			else
				uploadData.isNew = false;
			
			uploadData.docValidityPeriod = $scope.fileData.docValidityPeriod;
			uploadData.docNumber = $scope.fileData.docNumber;
			uploadData.docNin = $scope.fileData.docNin;
			uploadData.docCategory = $scope.fileData.docCategory;
			uploadData.accountNumber = $scope.fileData.accountNumber;
			uploadData.isNew = 1;
			
			for(var i = 0 ; i < $scope.fileData.selectedNins.length ; i++){
				ninsArray.push($scope.fileData.selectedNins[i].id);
			}
			uploadData.selectedNins = ninsArray;
			item.formData.push(uploadData);
			$scope.showAttachmentMsg = false;
			$scope.fileData.docCategory = null;
			$scope.group8Form.fileTypeError = false;
		} else {
			$scope.showQueueErrorMessage = true;
		}
	};
	
	uploader.onWhenAddingFileFailed = function(item,
			filter, options) {
		$scope.fileTypeError = true;
	};
	
	$scope.uploadDocument = function(){
		$scope.saveInProgress = true;
		$("#attachment-confirmation-modale").modal("hide");
		if($scope.deletedFiles.length > 0){
			if($scope.fromWhere == "next")
				$scope.deleteFilesAndNext();
			if($scope.fromWhere == "save")
				$scope.deleteFilesAndSave();
		}else
			$scope.uploader.uploadAll();
	}
	
	uploader.onCompleteItem = function(item, response,
			status, headers) {
		if (response.code != 0) {
			item.isUploaded = false;
			if (response.code == 450) {
				$scope.showInfectedMessage = true;
			}
		} else {
			$scope.fileData.docCategory = null;
		}
	}

	uploader.onCompleteAll = function() {
		var completeFlag = true
		$scope.uploadCompleted = false;
		$scope.saveInProgress = false;

		for (var i = 0; i < $scope.uploader.queue.length; i++) {
			if (!$scope.uploader.queue[i].isUploaded)
				completeFlag = false;
		}
		if (!completeFlag) {
			for (var k = 0; k < $scope.uploader.queue.length; k++) {
				$scope.uploader.queue[k].isUploaded = false;
				$scope.uploader.queue[k].isError = true
				$scope.uploader.queue[k].isSuccess = false;
				$scope.uploader.queue[k].progress = 0;
			}
			$scope.showResultMessage();
		} else {
			$scope.fileData.docCategory = null;
		}
		if (completeFlag) {
			$scope.uploadCompleted = true;
			$scope.showResultMessage();
		}
	}
	
// About to expired uploader
	
	$scope.getReplacingDocumentId = function(id){
		if(!!id){
			$scope.replacingId = id;
		}else
			$scope.replacingId = null;
	}
	
	var aboutToExpiredUploader = $scope.aboutToExpiredUploader = new FileUploader({
		url : API_ROOT_URL + "/document",
		queueLimit : 4

	});

	aboutToExpiredUploader.filters
			.push({
				name : 'fileFilter',
				fn : function(item, options) {
					var type = '|'
							+ item.type
									.slice(item.type
											.lastIndexOf('/') + 1)
							+ '|';
					if (type && type.length > 0)
						type = type.toLowerCase();
					if ('|jpg|png|jpeg|bmp|pdf|'
							.indexOf(type) === -1){
						$scope.fileTypeError =  true;
						return false;
					}
						
					if (item.size > 2000000){
						$scope.fileTypeError =  true;
						return false;
					}
						
					$scope.fileTypeError = false;
					return true;
				}
			});
	
	aboutToExpiredUploader.onAfterAddingFile = function(item) {
		$scope.aboutToExpiredUploaderQueueLength = $scope.aboutToExpiredUploader.queue.length + $scope.aboutToExpiredUploadedFiles.length;
		var ninsArray = [];
		if ($scope.aboutToExpiredUploaderQueueLength <= $scope.documentArray.length) {
			$scope.aboutToExpiredUploaderQueueErrorMessage = false;
			item.fileType = $scope.type;
			var uploadData = new Object();
			if (null != $scope.aboutExpierdFileData.docIssueDate)
				uploadData.docIssueDate = $scope.aboutExpierdFileData.docIssueDate.day
						+ $scope.aboutExpierdFileData.docIssueDate.month
						+ $scope.aboutExpierdFileData.docIssueDate.year;
			if (null != $scope.aboutExpierdFileData.docHDateOfBirth)
				uploadData.docHDateOfBirth = $scope.aboutExpierdFileData.docHDateOfBirth.day
						+ $scope.aboutExpierdFileData.docHDateOfBirth.month
						+ $scope.aboutExpierdFileData.docHDateOfBirth.year;
			if (null != $scope.aboutExpierdFileData.docGDateOfBirth)
				uploadData.docGDateOfBirth = $scope.aboutExpierdFileData.docGDateOfBirth.day
						+ $scope.aboutExpierdFileData.docGDateOfBirth.month
						+ $scope.aboutExpierdFileData.docGDateOfBirth.year;
			if (null != $scope.aboutExpierdFileData.docStartDate)
				uploadData.docStartDate = $scope.aboutExpierdFileData.docStartDate.day
						+ $scope.aboutExpierdFileData.docStartDate.month
						+ $scope.aboutExpierdFileData.docStartDate.year;
			if (!$scope.disableAboutToExpiredSentence_End_Date){
				if(null != $scope.aboutExpierdFileData.docEndDate)
				uploadData.docEndDate = $scope.aboutExpierdFileData.docEndDate.day
						+ $scope.aboutExpierdFileData.docEndDate.month
						+ $scope.aboutExpierdFileData.docEndDate.year;
			}
				uploadData.isNew = 0;
			
			uploadData.docValidityPeriod = $scope.aboutExpierdFileData.docValidityPeriod;
			uploadData.docNumber = $scope.aboutExpierdFileData.docNumber;
			uploadData.docNin = $scope.aboutExpierdFileData.docNin;
			uploadData.docCategory = $scope.aboutExpierdFileData.docCategory;
			uploadData.accountNumber = $scope.aboutExpierdFileData.accountNumber;
			uploadData.replacingDocumentId = $scope.replacingId;
			
			for(var i = 0 ; i < $scope.aboutExpierdFileData.selectedNins.length ; i++){
				ninsArray.push($scope.aboutExpierdFileData.selectedNins[i].id);
			}
			uploadData.selectedNins = ninsArray;
			item.formData.push(uploadData);
			$scope.aboutToExpiredAttachmentMsg = false;
			$scope.aboutExpierdFileData.docCategory = null;
			$scope.fileTypeError = false;
		} else {
			$scope.aboutToExpiredUploaderQueueErrorMessage = true;
		}
	};
	
	$scope.EmptyAboutToExpiredFileds = function() {
		$scope.aboutExpierdFileData.docHDateOfBirth = null;
		$scope.aboutExpierdFileData.docGDateOfBirth = null;
		$scope.aboutExpierdFileData.docIssueDate = null;
		$scope.aboutExpierdFileData.docStartDate = null;
		$scope.aboutExpierdFileData.docEndDate = null;
		$scope.aboutExpierdFileData.docValidityPeriod = null;
		$scope.aboutExpierdFileData.docNumber = null;
		$scope.aboutExpierdFileData.docNin = null;
		$scope.aboutExpierdFileData.accountNumber = null;
		$scope.aboutExpierdFileData.selectedNins = [];
		$scope.disableAboutToExpiredSentence_End_Date = false;
	}
	
	aboutToExpiredUploader.onWhenAddingFileFailed = function(item,
			filter, options) {
		$scope.fileTypeError = true;
	};
	
	$scope.uploadAboutToExpiredDocument = function(){
		$scope.saveInProgress = true;
		if($scope.validateAboutExpierdDocument()){
			$scope.aboutToExpiredUploader.uploadAll();
		}else{
			$scope.aboutToExpiredAttachmentMsg = true;
			$scope.saveInProgress = false;
		}
	}
	
	aboutToExpiredUploader.onCompleteItem = function(item, response,
			status, headers) {
		if (response.code != 0) {
			item.isUploaded = false;
			if (response.code == 450) {
				$scope.showAboutToExpiredInfectedMessage = true;
			}
		} else {
			$scope.aboutExpierdFileData.docCategory = null;
		}
	}

	aboutToExpiredUploader.onCompleteAll = function() {
		var completeFlag = true
		$scope.aboutToExpiredUploadCompleted = false;

		for (var i = 0; i < $scope.aboutToExpiredUploader.queue.length; i++) {
			if (!$scope.aboutToExpiredUploader.queue[i].isUploaded)
				completeFlag = false;
		}
		if (!completeFlag) {
			for (var k = 0; k < $scope.aboutToExpiredUploader.queue.length; k++) {
				$scope.aboutToExpiredUploader.queue[k].isUploaded = false;
				$scope.aboutToExpiredUploader.queue[k].isError = true
				$scope.aboutToExpiredUploader.queue[k].isSuccess = false;
				$scope.aboutToExpiredUploader.queue[k].progress = 0;
			}
			$scope.showAboutToExpiredResultMessage();
		} else {
			$scope.aboutExpierdFileData.docCategory = null;
			$scope.aboutToExpiredUploadCompleted = true;
		}
		if (completeFlag) {
			$scope.uploadCompleted = true;
			$scope.showAboutToExpiredResultMessage();
		}
	}
	
	$scope.showAboutToExpiredResultMessage = function(){
		if(!$scope.aboutToExpiredUploadCompleted && $scope.showAboutToExpiredInfectedMessage){
			AlertService.error($scope,"لا يمكن القيام برفع المرفقات نظرا لاحتوائها على محتويات غير آمنة")
			$scope.saveInProgress = false;
			$scope.form.$submitted = false;
			return;
		}else if(!$scope.aboutToExpiredUploadCompleted && !$scope.showAboutToExpiredInfectedMessage){
			AlertService.error($scope,"حدث خطأ أثناء رفع مرفقات التابعين, الرجاء معاودة رفع المرفقات")
			$scope.saveInProgress = false;
			$scope.form.$submitted = false;
			return;
		}else if($scope.aboutToExpiredUploadCompleted){
				AlertService.success($scope,"تم حفظ البيانات بنجاح");
				$scope.aboutToExpiredUploader.queue = [];
				$scope.getUploadedFiles();
				$scope.saveInProgress = false;
				$scope.form.$submitted = false;
				return;
		}else{
			AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
			$scope.saveInProgress = false;
			$scope.form.$submitted = false;
			return;
		}
	}
	
	$scope.disableAboutToExpiredSentenceEndDate = function(){
		$scope.aboutExpierdFileData.docEndDate = null;
		$scope.disableAboutToExpiredSentence_End_Date = !$scope.disableAboutToExpiredSentence_End_Date;
	}
	
	$scope.validateAboutExpierdDocument = function(){
		var count = 0;
		var documentTypes = [];
		var uploadedDocumentTypes = [];
		
		if ($scope.aboutExpierdFileData.docCategory != null && $scope.aboutExpierdFileData.docCategory != "0") {
			return false;
		}
		
		for(var i = 0 ; i < $scope.aboutToExpiredUploader.queue.length ; i++){
			documentTypes.push(parseInt($scope.aboutToExpiredUploader.queue[i].formData[0].docCategory));
		}
		
		for(var l = 0 ; l < $scope.aboutToExpiredUploadedFiles.length ; l++){
			uploadedDocumentTypes.push(parseInt($scope.aboutToExpiredUploadedFiles[l].category));
		}
		
		for(var k = 0 ; k < $scope.documentArray.length ; k++){
			if(documentTypes.indexOf($scope.documentArray[k].Key) != -1)
				count++;
			else if(uploadedDocumentTypes.indexOf($scope.documentArray[k].Key) != -1)
				count++;
		}
		if(count == $scope.documentArray.length){
			return true;
		}else 
			return false;
	}
	
	
}]);
/**
 * @author asealghamdi
 *
 */

var EligibilityControllers = angular.module("eligibilityControllers", []);

EligibilityControllers.controller("EligibilityPageController", ["$scope", "$rootScope","$http", "$location" , "EligibilityService" , "AlertService" , "FileUploader", "API_ROOT_URL","ApplicationService", function($scope, $rootScope, $http, $location , EligibilityService , AlertService, FileUploader, API_ROOT_URL, ApplicationService) {
	 
	$scope.showApplicantIneligibilityReasonsPage = false;
	$scope.showApplicantDependentsEligibilityPage = false;
	$scope.noDependentIsClicked=true;
	// pagination
	$rootScope.curPage = 0;
	$rootScope.pageSize = 10;
	$rootScope.listToPAginate = [];
	$scope.infoList = [];
	$scope.dropDownNins = [];
	$scope.fileData = new Object();
	$scope.fileData.selectedNins = [];
	$scope.documentArray = [];

	$rootScope.numberOfPages = function() 
	 {
	 return Math.ceil($rootScope.listToPAginate.length / $scope.pageSize);
	 };
	
	$scope.nextPage = function(){
		if($rootScope.curPage < (($rootScope.listToPAginate.length/$rootScope.pageSize)-1)){
			$rootScope.curPage = $rootScope.curPage+1;
		}
	}
	
	$scope.prevousPage = function(){
		if($rootScope.curPage > 0){
			$rootScope.curPage = $rootScope.curPage-1;
		}
	}
	
	
	ApplicationService.loadDependentAndHOH().then(function(tabData3) {
		$scope.tabData3 = tabData3.data;
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
		
		
	}, function(reason) {
			AlertService.error($scope);
		});
	
	EligibilityService.retrieveActiveAppeals().success(function(result){
		var activeAppealsList = result.value;
		$scope.activeAppealsIds = [];
		for(var i = 0 ; i < activeAppealsList.length ; i++){
			$scope.activeAppealsIds.push(activeAppealsList[i].ineligibilityReasonCode);
		}
	}, function(reason) {
		AlertService.error($scope);
	});
	
	
	$scope.createAppeal = function(ineligibilityCode , inEligibilityReasonsProcessDate, dependentNin, applicantNin, ineligibilityReasonText, ineligibilityReasonId, index, dependentIndex){
		// check if document is needed.
		if(ineligibilityCode != $scope.ineligibilityCode){
			$scope.clearData(false, true, true);
		}
		$scope.ineligibilityCode = ineligibilityCode;
		$scope.appealIndex = index;
		$scope.dependentIndex = dependentIndex;
		EligibilityService.getRequiredDocsForIneligibilityCode(ineligibilityCode).success(function(result){
			$scope.documentInfoArray = [];
			$scope.documentArray = [];
			$scope.backEndObject = result.value;
			$scope.documentObject = new Object();
			var documentArray = [];
			if(!!result && result.messageCode == 100){
				var defaultErrorMessage = "لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً";
				AlertService.error($scope, defaultErrorMessage);
				return;
			}
			if(!!result.value && result.value.Operator != 0){
				$scope.documentObject.array = result.value.Items;
				$scope.documentObject.operator = result.value.Operator;
				for(var i = 0 ; i < $scope.documentObject.array.length ; i++){
					documentArray.push($scope.documentObject.array[i]);
				}
				for(var i = 0 ; i < $scope.documentObject.array.length ; i++){
					if($scope.documentObject.array[i].Operator == 2){
						for(var l = 0 ; l < documentArray[i].Group.length ; l++){
							var keyValueOperatorObject = new Object;
							keyValueOperatorObject.value = documentArray[i].Group[l].Value;
							keyValueOperatorObject.key = documentArray[i].Group[l].Key
							keyValueOperatorObject.operator = 2;
							$scope.documentArray.push(keyValueOperatorObject);
						}
					}else{
						for(var k = 0 ; k < documentArray[i].Group.length ; k++){
							var keyValueOperatorObject = new Object;
							keyValueOperatorObject.value = documentArray[i].Group[k].Value;
							keyValueOperatorObject.key = documentArray[i].Group[k].Key
							keyValueOperatorObject.operator = 1;
							$scope.documentArray.push(keyValueOperatorObject);
						}
					}
				}
				
				for(var i = 0 ; i < $scope.documentObject.array.length ; i++){
					if($scope.documentObject.array[i].Operator == 2){
						var value = "";
						for(var l = 0 ; l < documentArray[i].Group.length ; l++){
							if((documentArray[i].Group.length - 1) != l){
								value += documentArray[i].Group[l].Value + " أو ";
							}else
								value += documentArray[i].Group[l].Value;
						}
					}else{
						var value = "";
						for(var k = 0 ; k < documentArray[i].Group.length ; k++){
							if((documentArray[i].Group.length - 1) != k){
								value += documentArray[i].Group[k].Value + " و ";
							}else
								value += documentArray[i].Group[k].Value;
						}
					}
					$scope.documentInfoArray.push(value);
				}
				
				$scope.appealInfo = new Object();
				$scope.appealInfo.ineligibilityReasonDate = inEligibilityReasonsProcessDate;
				$scope.appealInfo.ineligibilityReasonCode = ineligibilityCode;
				$scope.appealInfo.nin = applicantNin;
				$scope.appealInfo.category = "إعتراض على عدم الأهلية";
				$scope.appealInfo.subcategory = ineligibilityReasonText;
				$scope.appealInfo.dependentNin = dependentNin;
				$scope.appealInfo.ineligibilityReasonId = ineligibilityReasonId;
				$scope.appealInfo.documents = [];
				if(!dependentNin)
					$scope.appealInfo.cycleId = $scope.currentCycleId;
				else
					$scope.appealInfo.cycleId = $scope.currentDepndentsCycleId;
				if($scope.documentArray.length > 0){
					for(var i = 0 ; i < $scope.documentInfoArray.length ; i++){
						$scope.infoList.push($scope.documentInfoArray[i]);
					}
					$("#appeal-document-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
						return (($(window).height() - $(this).height()) / 2) - 300;
					}});
				}else{
					$scope.appealInfo = new Object();
					$scope.appealInfo.ineligibilityReasonDate = inEligibilityReasonsProcessDate;
					$scope.appealInfo.ineligibilityReasonCode = ineligibilityCode;
					$scope.appealInfo.nin = applicantNin;
					$scope.appealInfo.category = "إعتراض على عدم الأهلية";
					$scope.appealInfo.subcategory = ineligibilityReasonText;
					$scope.appealInfo.dependentNin = dependentNin;
					$scope.appealInfo.ineligibilityReasonId = ineligibilityReasonId;
					$scope.appealInfo.documents = [];
					if(!dependentNin)
						$scope.appealInfo.cycleId = $scope.currentCycleId;
					else
						$scope.appealInfo.cycleId = $scope.currentDepndentsCycleId;
					EligibilityService.raiseAppeal($scope.appealInfo).success(function(result){
						if(result.code == 0){
							if(!!$scope.inEligibilityReasons){
								$scope.inEligibilityReasons[index].disableAppeal = true;
							}else
								$rootScope.applicantDependentsEligibilityInfo[dependentIndex].reasons[index].disableAppeal = true;
							AlertService.success($scope,"تم استقبال طلب الاعتراض");
						}else{
							AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
						}
					}, function(reason){
						AlertService.error($scope);
					});
				}
			}else{
				$scope.inEligibilityReasonsProcessDate = inEligibilityReasonsProcessDate;
				$scope.ineligibilityCode = ineligibilityCode;
				$scope.applicantNin = applicantNin;
				$scope.ineligibilityReasonText = ineligibilityReasonText;
				$scope.dependentNin = dependentNin;
				$scope.ineligibilityReasonId = ineligibilityReasonId;
				$("#no-attachment-confirmation-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
					return (($(window).height() - $(this).height()) / 2) - 300;
				}});	
			}
		});
	}
	
	$scope.raiseAppealWithNoDoc = function(){
		$scope.appealInfo = new Object();
		$scope.appealInfo.ineligibilityReasonDate = $scope.inEligibilityReasonsProcessDate;
		$scope.appealInfo.ineligibilityReasonCode = $scope.ineligibilityCode;
		$scope.appealInfo.nin = $scope.applicantNin;
		$scope.appealInfo.category = "إعتراض على عدم الأهلية";
		$scope.appealInfo.subcategory = $scope.ineligibilityReasonText;
		$scope.appealInfo.dependentNin = $scope.dependentNin;
		$scope.appealInfo.ineligibilityReasonId = $scope.ineligibilityReasonId;
		$scope.appealInfo.documents = [];
		if(!$scope.dependentNin)
			$scope.appealInfo.cycleId = $scope.currentCycleId;
		else
			$scope.appealInfo.cycleId = $scope.currentDepndentsCycleId;
		
		$("#no-attachment-confirmation-modale").modal("hide");
		// create appeal
		EligibilityService.raiseAppeal($scope.appealInfo).success(function(result){
			if(result.code == 0){
				if(!!$scope.inEligibilityReasons){
					$scope.inEligibilityReasons[index].disableAppeal = true;
				}else
					$rootScope.applicantDependentsEligibilityInfo[dependentIndex].reasons[index].disableAppeal = true;
				AlertService.success($scope,"تم استقبال طلب الاعتراض");
			}else{
				AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
			}
		}, function(reason){
			AlertService.error($scope);
		});
	}
	
	
	$scope.dropDownSettings = { 
			smartButtonMaxItems: 1 , smartButtonTextConverter: function(itemText, originalItem) { 
			return itemText; } 
	};
	
	$scope.addType = function(type) {
		if (type == 0) {
			$scope.showAttachmentMsg = false;
		}
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
			for(var i = 0 ; i < $scope.documentArray.length ; i++){
				if($scope.documentArray[i].Key == type){
					$scope.type = $scope.documentArray[i].Value;
					break;
				}else
					$scope.type = "";
			}
			$scope.clearData(false, false, false);
		}
	}
	
	var uploader = $scope.uploader = new FileUploader({
		url : API_ROOT_URL + "/document/upload-appeal-document",
		queueLimit : 4

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
	
	uploader.onAfterAddingFile = function(item) {
		var ninsArray = [];
		if ($scope.uploader.queue.length <= 4) {
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
			uploadData.docValidityPeriod = $scope.fileData.docValidityPeriod;
			uploadData.docNumber = $scope.fileData.docNumber;
			uploadData.docNin = $scope.fileData.docNin;
			uploadData.docCategory = $scope.fileData.docCategory;
			uploadData.accountNumber = $scope.fileData.accountNumber;
			
			for(var i = 0 ; i < $scope.fileData.selectedNins.length ; i++){
				ninsArray.push($scope.fileData.selectedNins[i].id);
			}
			uploadData.selectedNins = ninsArray;
			item.formData.push(uploadData);
			$scope.showAttachmentMsg = false;
			$scope.fileData.docCategory = null;
			$scope.fileTypeError = false;
			$scope.clearData(false, false, true);
		} else {
			$scope.showQueueErrorMessage = true;
		}
	};
	
	uploader.onWhenAddingFileFailed = function(item,
			filter, options) {
		$scope.fileTypeError = true;
	};
	
	uploader.onCompleteItem = function(item, response,
			status, headers) {
		if (response.code != 0) {
			item.isUploaded = false;
			if (response.code == 450) {
				$scope.showInfectedMessage = true;
			}
		}else
			item.formData[0].id = response.value;
	}

	uploader.onCompleteAll = function() {
		var completeFlag = true
		$scope.uploadCompleted = false;
		
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
			$scope.checkUploadAndRaiseAppeal();
		}
		if (completeFlag) {
			$scope.uploadCompleted = true;
			$scope.checkUploadAndRaiseAppeal();
		}
	}
	
	$scope.checkUploadAndRaiseAppeal = function(){
		if(!$scope.uploadCompleted && $scope.showInfectedMessage){
			$scope.clearData(true, false, true);
			AlertService.error($scope,"لا يمكن القيام برفع المرفقات نظرا لاحتوائها على محتويات غير آمنة")
			return;
		}else if(!$scope.uploadCompleted && !$scope.showInfectedMessage){
			$scope.clearData(true, false, true);
			AlertService.error($scope,"حدث خطأ أثناء رفع المرفقات , الرجاء معاودة رفع المرفقات")
			return;
		}else if($scope.uploadCompleted){
			$scope.metaDataArray = [];
			for(var i = 0 ; i < $scope.uploader.queue.length ; i++){
				$scope.metaDataArray.push($scope.uploader.queue[i].formData[0]);	
			}
			$scope.appealInfo.documents = $scope.metaDataArray;
			EligibilityService.raiseAppeal($scope.appealInfo).success(function(result){
				if(result.code == 0){
					$scope.clearData(true, true, true);
					if(!!$scope.inEligibilityReasons){
						$scope.inEligibilityReasons[$scope.appealIndex].disableAppeal = true;
					}else
						$rootScope.applicantDependentsEligibilityInfo[$scope.dependentIndex].reasons[$scope.appealIndex].disableAppeal = true;
					AlertService.success($scope,"تم استقبال طلب الاعتراض");
				}else{
					for (var i = 0; i < $scope.uploader.queue.length; i++) {
						$scope.uploader.queue[i].isUploaded = false;
						$scope.uploader.queue[i].isError = true
						$scope.uploader.queue[i].isSuccess = false;
						$scope.uploader.queue[i].progress = 0;
					}
					$scope.clearData(true, false, true);
					AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
				}
			}, function(reason){
				for (var i = 0; i < $scope.uploader.queue.length; i++) {
					$scope.uploader.queue[i].isUploaded = false;
					$scope.uploader.queue[i].isError = true
					$scope.uploader.queue[i].isSuccess = false;
					$scope.uploader.queue[i].progress = 0;
				}
				$scope.clearData(true, false, true);
				AlertService.error($scope);
			});
		}else{
			for (var i = 0; i < $scope.uploader.queue.length; i++) {
				$scope.uploader.queue[i].isUploaded = false;
				$scope.uploader.queue[i].isError = true
				$scope.uploader.queue[i].isSuccess = false;
				$scope.uploader.queue[i].progress = 0;
			}
			$scope.clearData(true, false, true);
			AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
			return;
		}
	}
	
	$scope.vlidateDocument = function(){
		var documentTypes = [];
		
		if ($scope.fileData.docCategory != null && $scope.fileData.docCategory != "0") {
			return false;
		}
		
		for(var i = 0 ; i < $scope.uploader.queue.length ; i++){
			documentTypes.push(parseInt($scope.uploader.queue[i].formData[0].docCategory));
		}
		
		if($scope.backEndObject.Operator == 1 ){
			
				
			for(var i=0; i < $scope.backEndObject.Items.length;i++ ){
				if($scope.backEndObject.Items[i].Operator == 2 ){
					var isuploaded= checkIfOneOfTheDocumentsProvided($scope.backEndObject.Items[i].Group,documentTypes);
					if(isuploaded){
						return true;
					}
				}else{
					var isuploaded= checkIfAllDocumentsProvided($scope.backEndObject.Items[i].Group,documentTypes);
					if(isuploaded){
						return true;
					}
				}
			}
			
			return false;
					
		}else{
					
			for(var i=0; i < $scope.backEndObject.Items.length;i++ ){
				if($scope.backEndObject.Items[i].Operator == 2 ){
					var isuploaded= checkIfOneOfTheDocumentsProvided($scope.backEndObject.Items[i].Group,documentTypes);
					if(!isuploaded){
						return false;
					}
				}else{
					var isuploaded=  checkIfAllDocumentsProvided($scope.backEndObject.Items[i].Group,documentTypes);
					if(!isuploaded){
						return false;
					}
				}
			}
			return true;
					
		}
	}
	
	function checkIfAllDocumentsProvided(listOfRequiredDocs,listOfProvidedDocs){
		for(var i = 0 ; i < listOfRequiredDocs.length ; i++){
			if(listOfProvidedDocs.indexOf(listOfRequiredDocs[i].Key) == -1)
				return false;
		}
		return true;
	}

	function checkIfOneOfTheDocumentsProvided(listOfRequiredDocs,listOfProvidedDocs){
		for(var i = 0 ; i < listOfRequiredDocs.length ; i++){
			if(listOfProvidedDocs.indexOf(listOfRequiredDocs[i].Key) != -1)
				return true;
		}
		return false;
	}
	
	$scope.clearData = function(hideModale , clearQueue, clearDocCategory){
		if(hideModale == true)
			$("#appeal-document-modale").modal("hide");
		
		if(clearQueue == true)
			$scope.uploader.queue = [];
		
		if(clearDocCategory == true)
			$scope.fileData.docCategory = null;
		
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
	
	$scope.uploadAndCreateAppeal = function(){
		if($scope.vlidateDocument()){
			$scope.showAttachmentMsg = false;
			$scope.uploader.uploadAll();
		}else
			$scope.showAttachmentMsg = true;
	}
	
	if($rootScope.applicantEligibilityInfo==undefined){
		EligibilityService.getEligibilityStatus().success(function(result) {
			$scope.eligibilityInfo = result.value;
			$rootScope.applicantEligibilityInfo = result.value;
			$scope.actionInProgress = false;
			
		}).error(function(result) {
			AlertService.error($rootScope);
		});
	}else{
		$scope.eligibilityInfo = $rootScope.applicantEligibilityInfo;
	}
	
	$scope.reaply = function(){
		EligibilityService.updateReapplyStatus().success(function(result) {
			if(result.code == 0){
				AlertService.roamingAlert('success','تم استقبال طلبك لإعادة التقديم');
				$rootScope.loggedInUser.applicant.reapplyStatus = 1;
				$scope.actionInProgress = false;
				$scope.loggedInUser.applicant.reapplyStatus =1;
			}else if(result.code==2){
				AlertService.roamingAlert('error','لا يمكنك إعادة تقديم الطلب الآن');
			}
			
		}).error(function(result) {
			AlertService.error($rootScope);
		});
	}
	
	$scope.getApplicantIneleigibilityReasons = function(processDate,processDateH){
		showPage("applicant-reasons")
		$scope.inEligibilityReasonsProcessDate = processDate;
		$scope.inEligibilityReasonsProcessDateH = processDateH;
		if($rootScope.applicantIneligibilityReasons==undefined){
			EligibilityService.getApplicantIneligibilityReasons().success(function(result) {
				$scope.inEligibilityReasons = result.value;
				
				var inEligibilityDate = new Date($scope.inEligibilityReasonsProcessDate);
				var today = new Date();
				today.setMonth(today.getMonth() + 3);
				if(inEligibilityDate.getTime() < today.getTime()){
					for(var i = 0 ; i < $scope.inEligibilityReasons.length ; i++){
						for(var k = 0 ; k < $scope.activeAppealsIds.length ; k++){
							if($scope.inEligibilityReasons[i].ruleMessageDetailId == $scope.activeAppealsIds[k]){
								$scope.inEligibilityReasons[i].disableAppeal = true;
								break;
							}else
								$scope.inEligibilityReasons[i].disableAppeal = false;
						}
					}
				}else{
					for(var i = 0 ; i < $scope.inEligibilityReasons.length ; i++){
						$scope.inEligibilityReasons[i].disableAppeal = true;
					}
				}
				
				$rootScope.applicantIneligibilityReasons = result.value;
				$rootScope.listToPAginate = $scope.inEligibilityReasons;
				$scope.actionInProgress = false;
				
			}).error(function(result) {
				AlertService.error($rootScope);
			});
		}else{
			$scope.inEligibilityReasons = $rootScope.applicantIneligibilityReasons;
			$rootScope.listToPAginate = $scope.inEligibilityReasons;
		}
		
		
	}
	
	$scope.getApplicantDependentsEligibility = function(cycleId){
		showPage("dependent-eligibility")
		
		if($rootScope.applicantDependentsEligibilityInfo==undefined){
			EligibilityService.getDependentsEligibilityInfo().success(function(result) {
				$scope.dependentsEligibilityInfo = result.value;
				$rootScope.applicantDependentsEligibilityInfo = result.value;
				$scope.actionInProgress = false;
				
			}).error(function(result) {
				AlertService.error($rootScope);
			});
		}else{
			$scope.dependentsEligibilityInfo = $rootScope.applicantDependentsEligibilityInfo;
		}
		if(!!$scope.dependentsEligibilityInfo){
			$scope.isAllDependentsEligible = true;
			for(var i = 0 ; i < $scope.dependentsEligibilityInfo.length; i++){
				if($scope.dependentsEligibilityInfo[i].eligibilitySatus == 0){
					$scope.isAllDependentsEligible = false;
					break;
				}
			}
		}
	}
	
	$scope.getDependentineligibilityReasons = function(dependent,cycleId){
		
		$scope.noDependentIsClicked=false;
		
		var depnIndex = getDependentIndex(dependent.dependentNin, $rootScope.applicantDependentsEligibilityInfo);
		
		if(depnIndex!=-1 && $rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons == undefined){
			
			EligibilityService.getDependentsInEligibilityInfo(dependent.dependentNin).success(function(result) {
				if(result.value ==null || result.value==undefined){
					result.value=false;
				}
				$scope.dependentIneligibilityReasons = result.value;
				$rootScope.listToPAginate = $scope.dependentIneligibilityReasons;
				$scope.InEligibileDependentFullInfo =dependent;
				$rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons = result.value;
				$rootScope.applicantDependentsEligibilityInfo[depnIndex].dependentFullInfo = dependent;
				$scope.actionInProgress = false;
				dependent.showResons=true;
				
				checkDependentReason(dependent, depnIndex);
				
			}).error(function(result) {
				AlertService.error($rootScope);
			});
			
		}else{
			$scope.dependentIneligibilityReasons = $rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons;
			$scope.InEligibileDependentFullInfo =$rootScope.applicantDependentsEligibilityInfo[depnIndex].dependentFullInfo ;
			$rootScope.listToPAginate = $scope.dependentIneligibilityReasons;
		}
		
		
	}
	
	function checkDependentReason(dependent, depnIndex){
		var inEligibilityDate = new Date(dependent.processDate);
		var today = new Date();
		today.setMonth(today.getMonth() + 3);
		if(inEligibilityDate.getTime() < today.getTime()){
			for(var i = 0 ; i < $rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons.length ; i++){
				for(var k = 0 ; k < $scope.activeAppealsIds.length ; k++){
					if($rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons[i].ruleMessageDetailId == $scope.activeAppealsIds[k]){
						$rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons[i].disableAppeal = true;
						break;
					}else
						$rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons[i].disableAppeal = false;
				}
			}
		}else{
			for(var i = 0 ; i < $rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons.length ; i++){
				$rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons[i].disableAppeal = true;
			}
		}
	}
	
	
	$scope.goToEligibilityHistoryPage = function(){
		$location.path("/eligibility-history");
	}
	
	 
//	Controller Utils
	
	function showPage(pageToBeShown){
		
		$scope.showApplicantIneligibilityReasonsPage = false;
		$scope.showApplicantDependentsEligibilityPage = false;
		
	switch(pageToBeShown) {
	    case "applicant-reasons":
	    	$scope.showApplicantIneligibilityReasonsPage = true;
	        break;
	    case "dependent-eligibility":
	    	$scope.showApplicantDependentsEligibilityPage = true;
	        break;
	    default:
	    	$scope.showApplicantIneligibilityReasonsPage = false;
			$scope.showApplicantDependentsEligibilityPage = false;
	}
	}
	
	function getDependentIndex(depNIN, list){
		for(var i=0; i <list.length;i++){
			if(list[i].dependentNin == depNIN){
				return i;
			}
		}
		return -1;
	}
}]);


EligibilityControllers.controller("EligibilityHistoryController", ["$scope", "$rootScope","$http", "$location" , "EligibilityService" ,"AlertService", "ApplicationService", "FileUploader", "API_ROOT_URL", function($scope, $rootScope, $http, $location , EligibilityService,AlertService, ApplicationService, FileUploader, API_ROOT_URL) {
	
	$scope.infoList = [];
	$scope.dropDownNins = [];
	$scope.fileData = new Object();
	$scope.fileData.selectedNins = [];
	$scope.documentArray = [];
	
	EligibilityService.getEligibilityStatusHistory().success(function(result) {
		$scope.showEligibilityReasons = false; 
		$scope.showEligibilityHistory = true;
		$scope.applicantEligibilityHistory = result.value;
		$scope.actionInProgress = false;
		
	}).error(function(result) {
		AlertService.error($rootScope);
	});

	
	$scope.getApplicantIneleigibilityReasonsHistory=function(cycleId, processDate, processDateH){
		EligibilityService.getApplicantIneligibilityReasonsHistory(cycleId).success(function(result) {
			EligibilityService.retrieveActiveAppeals().success(function(activeAppealsResult){
				var activeAppealsList = activeAppealsResult.value;
				$scope.activeAppealsIds = [];
				for(var i = 0 ; i < activeAppealsList.length ; i++){
					$scope.activeAppealsIds.push(activeAppealsList[i].ineligibilityReasonCode);
				}
				$scope.showEligibilityReasons = true; 
				$scope.showEligibilityHistory = false;
				$scope.inEligibilityReasons = result.value;
				if(!!$scope.inEligibilityReasons){
					for(var i = 0 ; i < $scope.inEligibilityReasons.length ; i++){
						$scope.inEligibilityReasons[i].inEligibilityReasonsProcessDate = processDate;
						$scope.inEligibilityReasons[i].inEligibilityReasonsProcessDateH = processDateH;
					}
				}
				
				var inEligibilityDate = new Date(processDate);
				var today = new Date();
				today.setMonth(today.getMonth() + 3);
				if(inEligibilityDate.getTime() < today.getTime()){
					for(var i = 0 ; i < $scope.inEligibilityReasons.length ; i++){
						for(var k = 0 ; k < $scope.activeAppealsIds.length ; k++){
							if($scope.inEligibilityReasons[i].ruleMessageDetailId == $scope.activeAppealsIds[k]){
								$scope.inEligibilityReasons[i].disableAppeal = true;
								break;
							}else
								$scope.inEligibilityReasons[i].disableAppeal = false;
						}
					}
				}else{
					for(var i = 0 ; i < $scope.inEligibilityReasons.length ; i++){
						$scope.inEligibilityReasons[i].disableAppeal = true;
					}
				}
				
				$scope.actionInProgress = false;
				$scope.currentCycleId = cycleId;
			}, function(reason) {
				AlertService.error($scope);
			});
		}).error(function(result) {
			AlertService.error($rootScope);
		});
	}

	$scope.getDepndentsEligibilityInfoHistory = function(cycleId){
		EligibilityService.getDependentsEligibilityInfoHistory(cycleId).success(function(result) {
			EligibilityService.retrieveActiveAppeals().success(function(activeAppealsResult){
				var activeAppealsList = activeAppealsResult.value;
				$scope.activeAppealsIds = [];
				for(var i = 0 ; i < activeAppealsList.length ; i++){
					$scope.activeAppealsIds.push(activeAppealsList[i].ineligibilityReasonCode);
				}
				$scope.showApplicantDependentsEligibilityPage = true;
				$scope.showEligibilityHistory = false;
				$scope.dependentsEligibilityInfo = result.value;
				$rootScope.applicantDependentsEligibilityInfo = result.value;
				$scope.actionInProgress = false;
				$scope.currentDepndentsCycleId = cycleId;
				
				if(!!$scope.dependentsEligibilityInfo){
					$scope.isAllDependentsEligible = true;
					for(var i = 0 ; i < $scope.dependentsEligibilityInfo.length; i++){
						if($scope.dependentsEligibilityInfo[i].eligibilitySatus == 0){
							$scope.isAllDependentsEligible = false;
							break;
						}
					}
				}
			}, function(reason) {
				AlertService.error($scope);
			});
		}).error(function(result) {
			AlertService.error($rootScope);
		});
	}
	
	$scope.getDependentineligibilityReasons =function(dependent,cycleId){
		
		$scope.noDependentIsClicked=false;
		
		var depnIndex = getDependentIndex(dependent.dependentNin, $rootScope.applicantDependentsEligibilityInfo);
		
		if(depnIndex!=-1 && $rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons == undefined){
			
			EligibilityService.getDependentsInEligibilityMessageHistory(cycleId,dependent.dependentNin).success(function(result) {
				if(result.value ==null || result.value==undefined){
					result.value=false;
				}
				$scope.dependentIneligibilityReasons = result.value;
				$rootScope.listToPAginate = $scope.dependentIneligibilityReasons;
				$scope.InEligibileDependentFullInfo =dependent;
				$rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons = result.value;
				$rootScope.applicantDependentsEligibilityInfo[depnIndex].dependentFullInfo = dependent;
				$scope.actionInProgress = false;
				dependent.showResons=true;
				
				checkDependentReason(dependent, depnIndex);
				
			}).error(function(result) {
				AlertService.error($rootScope);
			});
			
		}else{
			$scope.dependentIneligibilityReasons = $rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons;
			$scope.InEligibileDependentFullInfo =$rootScope.applicantDependentsEligibilityInfo[depnIndex].dependentFullInfo ;
			$rootScope.listToPAginate = $scope.dependentIneligibilityReasons;
		}
		
	}
	
	function checkDependentReason(dependent, depnIndex){
		var inEligibilityDate = new Date(dependent.processDate);
		var today = new Date();
		today.setMonth(today.getMonth() + 3);
		if(inEligibilityDate.getTime() < today.getTime()){
			for(var i = 0 ; i < $rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons.length ; i++){
				for(var k = 0 ; k < $scope.activeAppealsIds.length ; k++){
					if($rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons[i].ruleMessageDetailId == $scope.activeAppealsIds[k]){
						$rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons[i].disableAppeal = true;
						break;
					}else
						$rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons[i].disableAppeal = false;
				}
			}
		}else{
			for(var i = 0 ; i < $rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons.length ; i++){
				$rootScope.applicantDependentsEligibilityInfo[depnIndex].reasons[i].disableAppeal = true;
			}
		}
	}
	
	$scope.showEligibilityHistoryPAge=function(){
		$scope.showEligibilityReasons=false;
		$scope.showApplicantDependentsEligibilityPage = false;
		$scope.showEligibilityHistory=true;
	}
	
	//Appeal changes
	
	ApplicationService.loadDependentAndHOH().then(function(tabData3) {
		$scope.tabData3 = tabData3.data;
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
		
		
	}, function(reason) {
			AlertService.error($scope);
		});
	
	EligibilityService.retrieveActiveAppeals().success(function(result){
		var activeAppealsList = result.value;
		$scope.activeAppealsIds = [];
		for(var i = 0 ; i < activeAppealsList.length ; i++){
			$scope.activeAppealsIds.push(activeAppealsList[i].ineligibilityReasonCode);
		}
	}, function(reason) {
		AlertService.error($scope);
	});
	
	
	$scope.createAppeal = function(ineligibilityCode , inEligibilityReasonsProcessDate, dependentNin, applicantNin, ineligibilityReasonText, ineligibilityReasonId, index, dependentIndex){
		// check if document is needed.
		if(ineligibilityCode != $scope.ineligibilityCode){
			$scope.clearData(false, true, true);
		}
		$scope.ineligibilityCode = ineligibilityCode;
		$scope.appealIndex = index;
		$scope.dependentIndex = dependentIndex;
		EligibilityService.getRequiredDocsForIneligibilityCode(ineligibilityCode).success(function(result){
			$scope.documentArray = [];
			$scope.documentInfoArray = [];
			$scope.backEndObject = result.value;
			$scope.documentObject = new Object();
			var documentArray = [];
			if(!!result && result.messageCode == 100){
				var defaultErrorMessage = "لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً";
				AlertService.error($scope, defaultErrorMessage);
				return;
			}
			if(!!result.value && result.value.Operator != 0){
				$scope.documentObject.array = result.value.Items;
				$scope.documentObject.operator = result.value.Operator;
				for(var i = 0 ; i < $scope.documentObject.array.length ; i++){
					documentArray.push($scope.documentObject.array[i]);
				}
				for(var i = 0 ; i < $scope.documentObject.array.length ; i++){
					if($scope.documentObject.array[i].Operator == 2){
						for(var l = 0 ; l < documentArray[i].Group.length ; l++){
							var keyValueOperatorObject = new Object;
							keyValueOperatorObject.value = documentArray[i].Group[l].Value;
							keyValueOperatorObject.key = documentArray[i].Group[l].Key
							keyValueOperatorObject.operator = 2;
							$scope.documentArray.push(keyValueOperatorObject);
						}
					}else{
						for(var k = 0 ; k < documentArray[i].Group.length ; k++){
							var keyValueOperatorObject = new Object;
							keyValueOperatorObject.value = documentArray[i].Group[k].Value;
							keyValueOperatorObject.key = documentArray[i].Group[k].Key
							keyValueOperatorObject.operator = 1;
							$scope.documentArray.push(keyValueOperatorObject);
						}
					}
				}
				
				for(var i = 0 ; i < $scope.documentObject.array.length ; i++){
					if($scope.documentObject.array[i].Operator == 2){
						var value = "";
						for(var l = 0 ; l < documentArray[i].Group.length ; l++){
							if((documentArray[i].Group.length - 1) != l){
								value += documentArray[i].Group[l].Value + " أو ";
							}else
								value += documentArray[i].Group[l].Value;
						}
					}else{
						var value = "";
						for(var k = 0 ; k < documentArray[i].Group.length ; k++){
							if((documentArray[i].Group.length - 1) != k){
								value += documentArray[i].Group[k].Value + " و ";
							}else
								value += documentArray[i].Group[k].Value;
						}
					}
					$scope.documentInfoArray.push(value);
				}
				
				$scope.appealInfo = new Object();
				$scope.appealInfo.ineligibilityReasonDate = inEligibilityReasonsProcessDate;
				$scope.appealInfo.ineligibilityReasonCode = ineligibilityCode;
				$scope.appealInfo.nin = applicantNin;
				$scope.appealInfo.category = "إعتراض على عدم الأهلية";
				$scope.appealInfo.subcategory = ineligibilityReasonText;
				$scope.appealInfo.dependentNin = dependentNin;
				if(!dependentNin)
					$scope.appealInfo.cycleId = $scope.currentCycleId;
				else
					$scope.appealInfo.cycleId = $scope.currentDepndentsCycleId;
				$scope.appealInfo.ineligibilityReasonId = ineligibilityReasonId;
				$scope.appealInfo.documents = [];
				if($scope.documentArray.length > 0){
					for(var i = 0 ; i < $scope.documentInfoArray.length ; i++){
						$scope.infoList.push($scope.documentInfoArray[i]);
					}
					$("#appeal-document-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
						return (($(window).height() - $(this).height()) / 2) - 300;
					}});
				}else{
					$scope.appealInfo = new Object();
					$scope.appealInfo.ineligibilityReasonDate = inEligibilityReasonsProcessDate;
					$scope.appealInfo.ineligibilityReasonCode = ineligibilityCode;
					$scope.appealInfo.nin = applicantNin;
					$scope.appealInfo.category = "إعتراض على عدم الأهلية";
					$scope.appealInfo.subcategory = ineligibilityReasonText;
					$scope.appealInfo.dependentNin = dependentNin;
					if(!dependentNin)
						$scope.appealInfo.cycleId = $scope.currentCycleId;
					else
						$scope.appealInfo.cycleId = $scope.currentDepndentsCycleId;
					$scope.appealInfo.ineligibilityReasonId = ineligibilityReasonId;
					$scope.appealInfo.documents = [];
					// create appeal
					EligibilityService.raiseAppeal($scope.appealInfo).success(function(result){
						if(result.code == 0){
							if(!!$scope.inEligibilityReasons){
								$scope.inEligibilityReasons[index].disableAppeal = true;
							}else
								$rootScope.applicantDependentsEligibilityInfo[dependentIndex].reasons[index].disableAppeal = true;
							AlertService.success($scope,"تم استقبال طلب الاعتراض");
						}else{
							AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
						}
					}, function(reason){
						AlertService.error($scope);
					});
				}
			}else{
				$scope.inEligibilityReasonsProcessDate = inEligibilityReasonsProcessDate;
				$scope.ineligibilityCode = ineligibilityCode;
				$scope.applicantNin = applicantNin;
				$scope.ineligibilityReasonText = ineligibilityReasonText;
				$scope.dependentNin = dependentNin;
				$scope.ineligibilityReasonId = ineligibilityReasonId;
				$("#no-attachment-confirmation-modale").modal("show").find(".modal-dialog").css({'margin-top': function() {
					return (($(window).height() - $(this).height()) / 2) - 300;
				}});
			}	
		});
	}
	
	$scope.raiseAppealWithNoDoc = function(){
		$scope.appealInfo = new Object();
		$scope.appealInfo.ineligibilityReasonDate = $scope.inEligibilityReasonsProcessDate;
		$scope.appealInfo.ineligibilityReasonCode = $scope.ineligibilityCode;
		$scope.appealInfo.nin = $scope.applicantNin;
		$scope.appealInfo.category = "إعتراض على عدم الأهلية";
		$scope.appealInfo.subcategory = $scope.ineligibilityReasonText;
		$scope.appealInfo.dependentNin = $scope.dependentNin;
		$scope.appealInfo.ineligibilityReasonId = $scope.ineligibilityReasonId;
		$scope.appealInfo.documents = [];
		if(!$scope.dependentNin)
			$scope.appealInfo.cycleId = $scope.currentCycleId;
		else
			$scope.appealInfo.cycleId = $scope.currentDepndentsCycleId;
		
		$("#no-attachment-confirmation-modale").modal("hide");
		// create appeal
		EligibilityService.raiseAppeal($scope.appealInfo).success(function(result){
			if(result.code == 0){
				if(!!$scope.inEligibilityReasons){
					$scope.inEligibilityReasons[index].disableAppeal = true;
				}else
					$rootScope.applicantDependentsEligibilityInfo[dependentIndex].reasons[index].disableAppeal = true;
				AlertService.success($scope,"تم استقبال طلب الاعتراض");
			}else{
				AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
			}
		}, function(reason){
			AlertService.error($scope);
		});
	}
	
	$scope.dropDownSettings = { 
			smartButtonMaxItems: 1 , smartButtonTextConverter: function(itemText, originalItem) { 
			return itemText; } 
	};
	
	$scope.addType = function(type) {
		if (type == 0) {
			$scope.showAttachmentMsg = false;
		}
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
			for(var i = 0 ; i < $scope.documentArray.length ; i++){
				if($scope.documentArray[i].Key == type){
					$scope.type = $scope.documentArray[i].Value;
					break;
				}else
					$scope.type = "";
			}
			$scope.clearData(false, false, false);
		}
	}
	
	var uploader = $scope.uploader = new FileUploader({
		url : API_ROOT_URL + "/document/upload-appeal-document",
		queueLimit : 4

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
	
	uploader.onAfterAddingFile = function(item) {
		var ninsArray = [];
		if ($scope.uploader.queue.length <= 4) {
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
			uploadData.docValidityPeriod = $scope.fileData.docValidityPeriod;
			uploadData.docNumber = $scope.fileData.docNumber;
			uploadData.docNin = $scope.fileData.docNin;
			uploadData.docCategory = $scope.fileData.docCategory;
			uploadData.accountNumber = $scope.fileData.accountNumber;
			
			for(var i = 0 ; i < $scope.fileData.selectedNins.length ; i++){
				ninsArray.push($scope.fileData.selectedNins[i].id);
			}
			uploadData.selectedNins = ninsArray;
			item.formData.push(uploadData);
			$scope.showAttachmentMsg = false;
			$scope.fileData.docCategory = null;
			$scope.fileTypeError = false;
			$scope.clearData(false, false, true);
		} else {
			$scope.showQueueErrorMessage = true;
		}
	};
	
	uploader.onWhenAddingFileFailed = function(item,
			filter, options) {
		$scope.fileTypeError = true;
	};
	
	uploader.onCompleteItem = function(item, response,
			status, headers) {
		if (response.code != 0) {
			item.isUploaded = false;
			if (response.code == 450) {
				$scope.showInfectedMessage = true;
			}
		}else
			item.formData[0].id = response.value;
	}

	uploader.onCompleteAll = function() {
		var completeFlag = true
		$scope.uploadCompleted = false;
		
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
			$scope.checkUploadAndRaiseAppeal();
		}
		if (completeFlag) {
			$scope.uploadCompleted = true;
			$scope.checkUploadAndRaiseAppeal();
		}
	}
	
	$scope.checkUploadAndRaiseAppeal = function(){
		if(!$scope.uploadCompleted && $scope.showInfectedMessage){
			$scope.clearData(true, false, true);
			AlertService.error($scope,"لا يمكن القيام برفع المرفقات نظرا لاحتوائها على محتويات غير آمنة")
			return;
		}else if(!$scope.uploadCompleted && !$scope.showInfectedMessage){
			$scope.clearData(true, false, true);
			AlertService.error($scope,"حدث خطأ أثناء رفع المرفقات , الرجاء معاودة رفع المرفقات")
			return;
		}else if($scope.uploadCompleted){
			$scope.metaDataArray = [];
			for(var i = 0 ; i < $scope.uploader.queue.length ; i++){
				$scope.metaDataArray.push($scope.uploader.queue[i].formData[0]);	
			}
			$scope.appealInfo.documents = $scope.metaDataArray;
			EligibilityService.raiseAppeal($scope.appealInfo).success(function(result){
				if(result.code == 0){
					$scope.clearData(true, true, true);
					if(!!$scope.inEligibilityReasons){
						$scope.inEligibilityReasons[$scope.appealIndex].disableAppeal = true;
					}else
						$rootScope.applicantDependentsEligibilityInfo[$scope.dependentIndex].reasons[$scope.appealIndex].disableAppeal = true;
					AlertService.success($scope,"تم استقبال طلب الاعتراض");
				}else{
					for (var i = 0; i < $scope.uploader.queue.length; i++) {
						$scope.uploader.queue[i].isUploaded = false;
						$scope.uploader.queue[i].isError = true
						$scope.uploader.queue[i].isSuccess = false;
						$scope.uploader.queue[i].progress = 0;
					}
					$scope.clearData(true, false, true);
					AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
				}
			}, function(reason){
				for (var i = 0; i < $scope.uploader.queue.length; i++) {
					$scope.uploader.queue[i].isUploaded = false;
					$scope.uploader.queue[i].isError = true
					$scope.uploader.queue[i].isSuccess = false;
					$scope.uploader.queue[i].progress = 0;
				}
				$scope.clearData(true, false, true);
				AlertService.error($scope);
			});
		}else{
			for (var i = 0; i < $scope.uploader.queue.length; i++) {
				$scope.uploader.queue[i].isUploaded = false;
				$scope.uploader.queue[i].isError = true
				$scope.uploader.queue[i].isSuccess = false;
				$scope.uploader.queue[i].progress = 0;
			}
			$scope.clearData(true, false, true);
			AlertService.error($scope,"لايمكن إتمام الطلب الآن، يرجى المحاولة لاحقاً");
			return;
		}
	}
	
	$scope.vlidateDocument = function(){
		var documentTypes = [];
		
		if ($scope.fileData.docCategory != null && $scope.fileData.docCategory != "0") {
			return false;
		}
		
		for(var i = 0 ; i < $scope.uploader.queue.length ; i++){
			documentTypes.push(parseInt($scope.uploader.queue[i].formData[0].docCategory));
		}
		
		if($scope.backEndObject.Operator == 1 ){
			
				
			for(var i=0; i < $scope.backEndObject.Items.length;i++ ){
				if($scope.backEndObject.Items[i].Operator == 2 ){
					var isuploaded= checkIfOneOfTheDocumentsProvided($scope.backEndObject.Items[i].Group,documentTypes);
					if(isuploaded){
						return true;
					}
				}else{
					var isuploaded= checkIfAllDocumentsProvided($scope.backEndObject.Items[i].Group,documentTypes);
					if(isuploaded){
						return true;
					}
				}
			}
			
			return false;
					
		}else{
					
			for(var i=0; i < $scope.backEndObject.Items.length;i++ ){
				if($scope.backEndObject.Items[i].Operator == 2 ){
					var isuploaded= checkIfOneOfTheDocumentsProvided($scope.backEndObject.Items[i].Group,documentTypes);
					if(!isuploaded){
						return false;
					}
				}else{
					var isuploaded=  checkIfAllDocumentsProvided($scope.backEndObject.Items[i].Group,documentTypes);
					if(!isuploaded){
						return false;
					}
				}
			}
			return true;
					
		}
	}
	
	function checkIfAllDocumentsProvided(listOfRequiredDocs,listOfProvidedDocs){
		for(var i = 0 ; i < listOfRequiredDocs.length ; i++){
			if(listOfProvidedDocs.indexOf(listOfRequiredDocs[i].Key) == -1)
				return false;
		}
		return true;
	}

	function checkIfOneOfTheDocumentsProvided(listOfRequiredDocs,listOfProvidedDocs){
		for(var i = 0 ; i < listOfRequiredDocs.length ; i++){
			if(listOfProvidedDocs.indexOf(listOfRequiredDocs[i].Key) != -1)
				return true;
		}
		return false;
	}

	
	
	
	$scope.clearData = function(hideModale , clearQueue, clearDocCategory){
		if(hideModale == true)
			$("#appeal-document-modale").modal("hide");
		
		if(clearQueue == true)
			$scope.uploader.queue = [];
		
		if(clearDocCategory == true)
			$scope.fileData.docCategory = null;
		
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
	
	$scope.uploadAndCreateAppeal = function(){
		if($scope.vlidateDocument()){
			$scope.showAttachmentMsg = false;
			$scope.uploader.uploadAll();
		}else
			$scope.showAttachmentMsg = true;
	}
	
	
	function getDependentIndex(depNIN, list){
		for(var i=0; i <list.length;i++){
			if(list[i].dependentNin == depNIN){
				return i;
			}
		}
		return -1;
	}
}]);

EligibilityControllers.controller("EligibilityController", ["$scope", "$rootScope","$http", "$location" , "EligibilityService" , function($scope, $rootScope, $http, $location , EligibilityService ) {
	 
	$scope.loggedInUser = $rootScope.loggedInUser;
	$scope.isReapplyAllowed = true;


}]);




var applicantControllers = angular.module("applicantControllers", []);

applicantControllers.controller("RegisterApplicantController", ["$scope", "$location", "ApplicantService", "AlertService", "API_ROOT_URL" , "$rootScope", function($scope, $location, ApplicantService, AlertService, API_ROOT_URL , $rootScope) {
	$scope.reviewMode = false; // TODO Remove later after making the review page configurable

	$scope.data = {
		group1: {
	        Nin: null,
	        Date_Of_Birth_H: {
	            day: null,
	            month: null,
	            year: null
	        },
	        Date_Of_Birth_G: {
	            day: null,
	            month: null,
	            year: null
	        },
	        Mobile_Number: null,
	        Mobile_Number_Confirmation: null
	    }
	};
	

	$scope.savePageData = function() {
		if(!$scope.form.$valid ){
			$scope.form.$submitted = true;
			return;
		}
		ApplicantService.validateEnteredCaptchaText($scope.enteredCaptchaCode).success(function(enteredCaptchaCodeIsValid) {
			if (enteredCaptchaCodeIsValid === true) {
				$scope.data.enteredCaptchaCode = $scope.enteredCaptchaCode;
				$scope.actionInProgress = true;
				ApplicantService.registerApplicant($scope.data).success(function(result) {
					
					if (result.code === 1) {
						AlertService.error($rootScope, "الرجاء التأكد من صحة الرمز");						
					} else if (result.code === 2) {
						AlertService.error($rootScope, "الرجاء التأكد من صحة رقم الهوية المدخل");
					} else if (result.code === 3) {
						AlertService.error($rootScope, "عزيزي المستخدم، رقم الهوية المدخل مسجّل مسبقًا.الرجاء التواصل مع خدمة العملاء عبر الرقم 19912");
					} else if (result.code === 4) {
						AlertService.error($rootScope, "رقم الجوال المدخل موجود مسبقا الرجاء التواصل مع خدمة العملاء عبر الرقم 19912");
					} else if (result.code === 5) {
						AlertService.error($rootScope, "لا يمكنك التسجيل حالياً، لقد قمت بعشر محاولات تسجيل خلال الساعة الماضية");
					} else if (result.code === 6) {
						AlertService.error($rootScope, "عزيزي المستخدم، لم يتم تسجيلك في النظام حيث تشير سجلاتنا بأن رقم الهوية المدخل لا يتطابق مع سجلات الأحوال المدنية. رمز عدم قبول التسجيل  (101)  الرجاء التواصل مع خدمة العملاء عبر الرقم 19912");
					} else if (result.code === 7) {
						AlertService.error($rootScope, "عزيزي المستخدم، لا يمكن تسجيلك بالنظام لوجود خطأ في بياناتك.  رمز عدم قبول التسجيل (104) الرجاء التواصل مع خدمة العملاء عبر الرقم 19912");
					}else if (result.code === 8) {
						AlertService.error($rootScope, "الرجاء التأكد من تطابق رقم الجوال");
					}else if (result.code === 9) {
						AlertService.error($rootScope, "الرجاء إدخال تاريخ الميلاد");
					}else if (result.code === 10) {
						AlertService.error($rootScope, "عذرا، لا يمكنك التسجيل لأنك دون سن الاستحقاق.");
					}else if (result.code === 11) {
						AlertService.error($rootScope, "عزيزي المستخدم، لم يتم تسجيلك بالنظام حيث تشير سجلات الأحوال المدنية بأن المتقدم غير سعودي. رمز عدم قبول التسجيل (102). الرجاء التواصل مع خدمة العملاء عبر الرقم 19912");
					}else if (result.code === 12) {
						AlertService.error($rootScope, "رقم الجوال المدخل غير صحيح");
					}else if (result.code === 14) {
						AlertService.error($rootScope, "لقد قمت بتقديم طلب مسبقا وجاري التحقق من بيانات التسجيل، الرجاء الانتظار وسيتم إرسال رسالة نصية (SMS) لاحقا فور إتمام عملية التحقق. ", true);
					} else if (result.code === 18) {
						AlertService.error($rootScope, "عزيزي المستخدم،	لم يتم تسجيلك في النظام حيث تشير سجلاتنا بأن تاريخ الميلاد المدخل لا يتطابق مع سجلات الأحوال المدنية.	رمز عدم قبول التسجيل (103)	الرجاء التواصل مع خدمة العملاء عبر الرقم 19912", true);
					} else if(result.code === 15){
						var successMessage = "لقد تم استلام طلبك بنجاح وجاري التحقق من بيانات التسجيل، علما بأنه سيتم إرسال رسالة نصية (SMS) لاحقا فور إتمام عملية التحقق.";
						AlertService.roamingAlert("success", successMessage, true);
						$location.path("/login");

					}else if(result.code === 17){
						AlertService.error($rootScope, "عزيزي مستفيد الضمان الاجتماعي، لقد تم تسجيلك تلقائياً في حساب المواطن، سيمكنك الاطلاع على بياناتك وتحديثها على البوابة الإلكترونية بعد تاريخ 2 جمادى الآخرة 1438 الموافق 1 مارس 2017",true);
					}else if(result.code === 19) {
						AlertService.error($rootScope, "عذرا، لا يمكنك الاستمرار، هناك خطأ في بياناتك الشخصية، الرجاء مراجعة الأحوال المدنية لتصحيح الخطأ الموجود، رمز عدم قبول التسجيل (105)، الرجاء التواصل مع خدمة العملاء عبر الرقم 19912", true);
					}else{
						var successMessage = "تم تسجيلك بنجاح، نرجو إكمال البيانات عبر صفحة تسجيل الدخول، علما بأن اسم المستخدم وكلمة المرور سترسل إلى الجوال المنتهي بـ " + $scope.data.group1.Mobile_Number.substring(6);
						AlertService.roamingAlert("success", successMessage, true);
						$location.path("/login");
					}
					

					$scope.actionInProgress = false;
				}).error(function(result) {
					$scope.actionInProgress = false;
					if (result.code === 1) {
						AlertService.error($rootScope, "الرجاء التأكد من صحة الرمز");						
					} else if (result.code === 2) {
						AlertService.error($rootScope, "الرجاء التأكد من صحة رقم الهوية المدخل");
					} else if (result.code === 3) {
						AlertService.error($rootScope, "عزيزي المستخدم، رقم الهوية المدخل مسجّل مسبقًا.الرجاء التواصل مع خدمة العملاء عبر الرقم 19912 ");
					} else if (result.code === 4) {
						AlertService.error($rootScope, "رقم الجوال المدخل موجود مسبقا الرجاء التواصل مع خدمة العملاء عبر الرقم 19912");
					} else if (result.code === 5) {
						AlertService.error($rootScope, "لا يمكنك التسجيل حالياً، لقد قمت بعشر محاولات تسجيل خلال الساعة الماضية");
					} else if (result.code === 6) {
						AlertService.error($rootScope, "عزيزي المستخدم، لم يتم تسجيلك في النظام حيث تشير سجلاتنا بأن رقم الهوية المدخل لا يتطابق مع سجلات الأحوال المدنية. رمز عدم قبول التسجيل  (101)  الرجاء التواصل مع خدمة العملاء عبر الرقم 19912");
					} else if (result.code === 7) {
						AlertService.error($rootScope, "عزيزي المستخدم، لا يمكن تسجيلك بالنظام لوجود خطأ في بياناتك.  رمز عدم قبول التسجيل (104) الرجاء التواصل مع خدمة العملاء عبر الرقم 19912");
					}else if (result.code === 8) {
						AlertService.error($rootScope, "الرجاء التأكد من تطابق رقم الجوال");
					}else if (result.code === 9) {
						AlertService.error($rootScope, "الرجاء إدخال تاريخ الميلاد");
					}else if (result.code === 10) {
						AlertService.error($rootScope, "عذرا، لا يمكنك التسجيل لأنك دون سن الاستحقاق.");
					}else if (result.code === 11) {
						AlertService.error($rootScope, "عزيزي المستخدم، لم يتم تسجيلك بالنظام حيث تشير سجلات الأحوال المدنية بأن المتقدم غير سعودي. رمز عدم قبول التسجيل (102). الرجاء التواصل مع خدمة العملاء عبر الرقم 19912");
					}else if (result.code === 12) {
						AlertService.error($rootScope, "رقم الجوال المدخل غير صحيح");
					}else if (result.code === 14) {
						AlertService.error($rootScope, "لقد قمت بتقديم طلب مسبقا وجاري التحقق من بيانات التسجيل، الرجاء الانتظار وسيتم إرسال رسالة نصية (SMS) لاحقا فور إتمام عملية التحقق. ", true);
					} else if(result.code === 15){
						var successMessage = "لقد تم استلام طلبك بنجاح وجاري التحقق من بيانات التسجيل، علما بأنه سيتم إرسال رسالة نصية (SMS) لاحقا فور إتمام عملية التحقق.";
						AlertService.roamingAlert("success", successMessage, true);
						$location.path("/login");

					}else if(result.code === 17){
						AlertService.error($rootScope, "عزيزي مستفيد الضمان الاجتماعي، لقد تم تسجيلك تلقائياً في حساب المواطن، سيمكنك الاطلاع على بياناتك وتحديثها على البوابة الإلكترونية بعد تاريخ 2 جمادى الآخرة 1438 الموافق 1 مارس 2017",true);
					}else if (result.code === 18) {
						AlertService.error($rootScope, "عزيزي المستخدم،	لم يتم تسجيلك في النظام حيث تشير سجلاتنا بأن تاريخ الميلاد المدخل لا يتطابق مع سجلات الأحوال المدنية.	رمز عدم قبول التسجيل (103)	الرجاء التواصل مع خدمة العملاء عبر الرقم 19912", true);
					}else if(result.code === 19) {
						AlertService.error($rootScope, "عذرا، لا يمكنك الاستمرار، هناك خطأ في بياناتك الشخصية، الرجاء مراجعة الأحوال المدنية لتصحيح الخطأ الموجود، رمز عدم قبول التسجيل (105)، الرجاء التواصل مع خدمة العملاء عبر الرقم 19912", true);
					}else{
						AlertService.error($rootScope);
					}
					$scope.refreshCaptcha(); 
				});
			} else {
				$scope.refreshCaptcha(); 
				AlertService.error($rootScope, "الرجاء التأكد من صحة الرمز");
			}
		}).error(function() {
			AlertService.error($rootScope, "الرجاء التأكد من صحة الرمز");
		});
	};

	$scope.refreshCaptcha = function(){
		$scope.captchaImage = API_ROOT_URL + "/captcha-controller/captcha-image?" + new Date().getTime();
	};

	$scope.refreshCaptcha(); 
}]);


applicantControllers.controller("ChangePasswordController", ["$scope", "$rootScope", "$location", "ApplicantService","LoginService", "AlertService","AuthService", function($scope, $rootScope, $location, ApplicantService,LoginService, AlertService,AuthService) {
	
	$scope.user = new Object();
	$scope.user.oldPassword = '';
	$scope.user.newPassword = '';
	$scope.user.newPasswordConfirmation = '';
	$scope.actionInProgress = false;
	bindeZoomInAndOut();
	
	$scope.changePassword = function() {
		$scope.actionInProgress = true;
		ApplicantService.changeUserPassword($scope.user).success(function(status) {
			$scope.actionInProgress = false;
			if(status == 1){
				if ($rootScope.loggedInUser.needsPasswordReset === false) {
					$location.path("/show-profile");
				}
				if ($rootScope.loggedInUser.needsPasswordReset === true) {
					$rootScope.loggedInUser.needsPasswordReset = false;
					$rootScope.isDSSMessageShown = false;
					$location.path("/start");
				}
				var successMessage = "تم تحديث كلمة المرور بنجاح لرقم الهوية المنتهي بـ" + $rootScope.loggedInUser.nin.substring(6,10);
				AlertService.roamingAlert("success", successMessage);
				}else if(status == 2){
					AlertService.error($rootScope, "كلمة المرور الجديدة مطابقة لكلمة المرور القديمة الرجاء اختيار كلمة مرور أخرى");
				}else if (status == 3){
					AlertService.error($rootScope, "كلمة المرور يجب أن تكون من ستة إلى عشرة أحرف و أرقام");
				}else if (status == 4){
					AlertService.error($rootScope, "كلمة المرور الحالية المدخلة غير صحيحة، الرجاء التأكد وإعادة المحاولة من جديد");
				}
			}).error(function() {
				$scope.actionInProgress = false;
				AlertService.error($rootScope);
			});
	};
	
	$scope.cancelChangePassword = function(){
				$scope.actionInProgress = false;
				if ($rootScope.loggedInUser.needsPasswordReset === true) {
					LoginService.logout();
					AuthService.nullifyUser();
					$rootScope.loggedInUser = null;
				} 
					$location.path("/start");
			}
	
}]);


applicantControllers.controller("ResetPasswordController", ["$scope", "$rootScope", "$location", "ApplicantService", "AlertService", function($scope, $rootScope, $location, ApplicantService, AlertService ) {

	$scope.actionInProgress = false;
	
	$scope.resetPassword =  function(){
		$scope.actionInProgress = true;
		var resetPassForm = {
				nin : $scope.nin,
				dateOfBirth : $scope.DOByear + $scope.DOBmonth + $scope.DOBday,
				mobileNumber: $scope.mobileNumber + "",
				idExpiryDate: $scope.year +$scope.month+ $scope.day  ,
				dateType: $scope.dateType ,
				
		};
		
		ApplicantService.resetUserPassword(resetPassForm).success(function(status){
			$scope.actionInProgress = false;
			var successMessage = "تم تغيير (كلمة المرور) بنجاح، الرجاء تسجيل الدخول باسم المستخدم وكلمة المرور المرسلة إلى الجوال المنتهي بـ" + resetPassForm.mobileNumber.substring(6,10);
			AlertService.roamingAlert("success", successMessage);
			$location.path("/login");
			}).error(function(result) {
				$scope.actionInProgress = false;
				if(result.code == 7){
					AlertService.error($rootScope, "لا يمكن إتمام العملية، الرجاء التواصل مع خدمة العملاء 19912");
				}else{
					AlertService.error($rootScope, "البيانات المدخلة غير صحيحة، الرجاء التأكد وإعادة المحاولة من جديد");
				}
				
			});
		};
		
		$scope.isIqama = function(){
			var pattern= new RegExp("^[2]\\d{9}$");
			var res = pattern.test($scope.nin);
			if(res ===  false ){
				$scope.dateType = 'hijri';
				
			}else{
				$scope.dateType = 'gregorian';

			}
			$scope.DOByear = "";
			$scope.DOBmonth = "";
			$scope.DOBday = "";
			return res;
		};
		
	}]);

applicantControllers.controller("ChangeMobileNumberController", ["$scope", "$rootScope", "$location", "ApplicantService", "AlertService", function($scope, $rootScope, $location, ApplicantService, AlertService ) {

	// Change Mobile Form
	$scope.showTokenForm = false;
	$scope.changeMobileForm = new Object();
	$scope.changeMobileForm.nin = null;
	$scope.changeMobileForm.dateOfBirth = {"day": null, "month": null, "year": null};
	$scope.changeMobileForm.newMobileNumber = null;
	$scope.changeMobileForm.idExpiryDate = {"day": null, "month": null, "year": null};

	$scope.actionInProgress = false;

	$scope.changeMobileNumber =  function() {
		var serverChangeMobileForm = buildServerForm($scope.changeMobileForm)
		
		$scope.actionInProgress = true;
		ApplicantService.changeMobileNumber(serverChangeMobileForm).success(function(status) {
			$scope.actionInProgress = false;
			if (status.code == 0) {
//				AlertService.roamingAlert("success", "تم تعديل رقم الجوال بنجاح" );
//				$rootScope.loggedInUser.mobileNumber =  $scope.changeMobileForm.newMobileNumber;
//				$location.path("/show-profile");
				$scope.showTokenForm = true;
			} else if (status.code == 1) {
				AlertService.error($rootScope, "الرجاء التأكد من صحة رقم الهوية المدخل");
			} else if (status.code == 4) {
				AlertService.error($rootScope, "رقم الجوال المدخل موجود مسبقا الرجاء التواصل مع خدمة العملاء عبر الرقم 19912 ");
			} else if (status.code == 5) {
				AlertService.error($rootScope, "رقم الجوال الجديد مطابق لرقم الجوال القديم، الرجاء التأكد من رقم الجوال الجديد وإعادة المحاولة");	
			}else{
				AlertService.error($rootScope, "البيانات المدخلة غير صحيحة ، الرجاء التأكد وإعادة المحاولة من جديد");
			}
		}).error(function() {
			$scope.actionInProgress = false;
			AlertService.error($rootScope);
		});
	};

	$scope.sendTokenVerficationForchangeMobileNumber =  function(changeMobileToken) {
		
		ApplicantService.tokenVerficationMobileNumber(changeMobileToken).success(function(status) {
			if (status.code == 0) {
				$scope.showTokenForm = false;
				AlertService.roamingAlert("success", "تم تعديل رقم الجوال بنجاح" );
				$rootScope.loggedInUser.mobileNumber =  $scope.changeMobileForm.newMobileNumber;
				$location.path("/show-profile");
			} else if (status.code == 7) {
				AlertService.error($rootScope, "الرجاء إدخال كلمة المرور المرسلة بالشكل الصحيح");
			}
		}).error(function() {
			$scope.actionInProgress = false;
			AlertService.error($rootScope);
		});
	}
	
	$scope.cancelMobileTokenVerfication = function() {
		$location.path("/start");
	}
	
	function buildServerForm(changeMobileForm) {
		var serverChangeMobileForm = new Object();
		serverChangeMobileForm.nin = changeMobileForm.nin;
		serverChangeMobileForm.dateOfBirth = changeMobileForm.dateOfBirth.year + changeMobileForm.dateOfBirth.month + changeMobileForm.dateOfBirth.day;
		serverChangeMobileForm.newMobileNumber = changeMobileForm.newMobileNumber;
		serverChangeMobileForm.idExpiryDate = changeMobileForm.idExpiryDate.year + changeMobileForm.idExpiryDate.month + changeMobileForm.idExpiryDate.day;
		return serverChangeMobileForm;
	}
}]);

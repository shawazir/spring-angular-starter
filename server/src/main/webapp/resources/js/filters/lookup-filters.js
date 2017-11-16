angular.module("lookupFilters", []).filter("eligibilityStatus", function() {
	return function(input) {
		if (input) {
			return "مستحق";
		} else {
			return "غير مستحق";
		}
	};
}).filter("gender", ["$rootScope", function($rootScope) {
	return function(input) {
		if (input == $rootScope.cache.enums.Gender.MALE) {
			return "ذكر";
		} if (input == $rootScope.cache.enums.Gender.FEMALE) {
			return "أنثى";
		} if (input == $rootScope.cache.enums.Gender.UNKNOWN) {
			return "غير معروف";
		} else {
			return "";
		}
	};
}]).filter("yakeenGender", function() {
	return function(input) {
		if (input === "1") {
			return "ذكر";
		} if (input === "2") {
			return "أنثى";
		} if (input === "-1") {
			return "غير معروف";
		} else {
			return "";
		}
	};
}).filter("yakeenLifeStatus", function() {
	return function(input) {
		if (input === "0") {
			return "حي";
		} if (input === "1") {
			return "ميت";
		} if (input === -1) {
			return "غير معروف";
		} else {
			return "";
		}
	};
}).filter("accountStatus", function() {
	return function(input) {
		if (input === "ACTIVE") {
			return "مفعل";
		} if (input === "BLOCKED") {
			return "مغلق";
		} if (input === "SUSPENDED"){
			return "موقف";
		}if(input === "DELETED"){
			return "محذوف";
		} else {
			return "";
		}
	};
}).filter("applicationStatus", function() {   
	
	return function(input) {
		if (input === "COMP") {
			return "مكتمل";
		}else if (input === "NEW") {
			return "طلب جديد";
		}
		else if (input === "CWAD") {
			return "مكتمل مع موافقة المرفقات";
		}
		else if (input === "CWRD") {
			return "مكتمل مع رفض المرفقات";
		}
		else if (input === "FCAD") {
			return "مكتمل كليًّا  مع موافقة المرفقات";
		}
		else if (input === "FCRD") {
			return "مكتمل كليًّا  مع رفض المرفقات";
		}
		else if (input === "CWD") {
			return "مكتمل بدون مرفقات ";
		}else if (input === "FCWD") {
			return "مكتمل كليًّا  بدون مرفقات ";
		}else{
			return "غير معروف";
		}
	};
}).filter("lifeStatus", function() {
	return function(input) {
		if (input === "ALIVE") {
			return "حي";
		}else if (input === "DECEASED") {
			return "متوفي";
		}else{
			return "غير معروف";
		}
	};
}).filter("maritalStatusForYakeen", function() {
	return function(input , gender , nin) {
		if (!input || !gender || !nin) {
			return "";
		}

		isSaudi = nin.charAt(0) === '1';
		if (input === "SINGLE") {
			return "أعزب";
		} if (input === "MARRIED" &&  gender === "MALE") {
			return "متزوج";
		} if (input === "MARRIED" &&  gender === "FEMALE" && isSaudi) {
			return "متزوجة";
		} if (input === "DIVORCED" && !isSaudi){
			return "مطلق";
		} if (input === "DIVORCED" &&  gender === "FEMALE" && isSaudi){
			return "مطلقة";
		} if(input === "WIDOW" && !isSaudi){
			return "أرمل";
		} if(input === "WIDOW" &&  gender === "FEMALE" && isSaudi){
			return "ارملة";
		} if(input === "SEPARATED" && !isSaudi){
			return "منفصل";
		} else {
			return "غير ذلك";
		}
	};
}).filter("userEligibilityStatus", function() {
	return function(input) {
		if (input === 1) {
			return "مستحق";
		}else if(input === 0) {
			return "غير مستحق";
		}else if(input === -1){
			return "البيانات غير مكتملة";
		}else if(input === 2){
			return "معلومات غير مكتملة";
		}
	};
}).filter("regionFilter", ['_', function(_) {
		return function(input) {
			var coordinate = _.result(_.find(DYNAMICALY_GENERATED_COORDINATE_LISTS, { 'placeCode': parseInt(input)  }), 'coordinate');
			if (coordinate !=undefined)
			{
				return '[' + coordinate + ']';
			}
			else
			{
				return input;
			}
		};
}]).filter("contactUs", function() {
	return function(input) {
		switch (input) {
			case 10601: return "Portal";
			case 10602: return "MoSA";
			case 10701: return "Password";
			case 10702: return "Account Status";
			case 10703: return "Mobile Number";
			case 10704: return "Beneficiary File";
			case 10801: return "Problem in Section";
			case 10802: return "State of Maturity";
			case 10803: return "Other assistance";
		}
		
	};
}).filter("incomeType", function() {
	return function(input) {
		switch (input) {
			case "29001": return "راتب شهري";
			case "29002": return "راتب تقاعدي";
			case "29003": return "نشاط تجاري";
			case "29004": return "غير ذلك";
		}
	};
}).filter("incomeSource", function() {
	return function(input) {
		switch (input) {
			case "30001": return "راتب من القطاع الحكومي أو العسكري";
			case "30002": return "دخل من القطاع الخاص";
			case "30003": return "راتب تقاعدي من القطاع الحكومي أو العسكري";
			case "30004": return "مخصص من برنامج حافز";
			case "30005": return "برنامج دعم حكومي";
			case "30006": return "مخصص من برنامج ساند";
			case "30007": return "سجل تجاري";
			case "30008": return "رخصة محل تجاري";
			case "30009": return "غير ذلك";
		}
	};
}).filter("ninToNationality", function() {
	return function(input, nin,editableNin) {
		var value;
		if (nin) {
			value=nin;
		}else if(editableNin){
			value=editableNin;
		}else{
			return "";
		}
		if (value.charAt(0) == 1) {
			return "سعودي";
		} else if (value.charAt(0) == 2) {
			return "غير سعودي";
		}
	};
}).filter("documentType", function() {
	return function(input) {
		switch (input) {
		case 23001 : return "صك إعالة";
		case 23002 : return "صك الولاية";
		case 23003 : return "إثبات الاحتضان";
		case 23004 : return "صك شرعي بعدم الأهلية";
		case 23005 : return "عقد الايجار";
		case 23006 : return "صك الملكية";
		case 23007 : return "عقد ايجار العائلة";
		case 23008 : return "صك ملكية العائلة";
		case 23009 : return "مستند من المستشفى توضح الحالة المرضية";
		case 23010 : return "مستند من السجن";
		case 23011 : return "محضر تبليغ من الشرطة";
		case 23012 : return "صك شرعي بالغياب او الفقد";
		case 23014 : return "خطاب الموافقة الاساسية من وزارة الداخلية";
		case 23015 : return "شريحة حديثة من الاحوال المدنية تثبت زواجها من أجنبي";
		case 23016 : return "فاتورة الكهرباء";
		case 23017 : return "فاتورة كهرباء العائلة";
		default : return input;
		}
	};
}).filter("appealStatus", function() {
	return function(input) {
		switch (input) {
		case 12001 : return "تحت الدراسة";
		case 12002 : return "تمت الموافقة";
		case 12003 : return "منتهية";
		case 12004 : return "تم الرفض";
		default : return input;
		}
	};
}).filter("documentStatus", function() {
	return function(input) {
		switch (input) {
		case 90801 : return "تحت الإجراء";
		case 90802 : return "تمت الموافقة";
		case 90803 : return "تم الرفض";
		case 90804 : return "وثيقة منتهية";
		case 90805 : return "تم الرفض";
		case 90806 : return "وثيقة شارفة على الإنتهاء";
		default : return input;
		}
	};
});
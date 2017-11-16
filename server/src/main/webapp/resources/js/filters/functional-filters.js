angular.module("functionalFilters", []).filter("limitedTo", function() {
	return function(input, limit, begin) {
	  if (Math.abs(Number(limit)) === Infinity) {
	      limit = Number(limit);
	    } else {
	      limit = parseInt(limit);
	    }
	    if (isNaN(limit)) return input;

	    if (!isNaN(input)) input = input.toString();
	    if (!Array.isArray(input) && !typeof input === "string") return input;

	    begin = (!begin || isNaN(begin)) ? 0 : parseInt(begin);
	    begin = (begin < 0 && begin >= -input.length) ? input.length + begin : begin;

	    if(input !== undefined){
		    if (limit >= 0) {
		      return input.slice(begin, begin + limit);
		    } else {
		      if (begin === 0) {
		        return input.slice(limit, input.length);
		      } else {
		        return input.slice(Math.max(0, begin + limit), begin);
		      }
		    }
	    }
	};
}).filter("concatenateFourPartsDependentName", function() {
	return function(input) {
		if (!input || !input.Dependent_First_Name) {
			return ""
		} else {
			var fullName = input.Dependent_First_Name + " ";

			if (input.Dependent_Father_Name) {
				fullName = fullName + input.Dependent_Father_Name + " ";
			}

			if (input.Dependent_Grandfather_Name) {
				fullName = fullName + input.Dependent_Grandfather_Name + " ";
			}

			if (input.Dependent_Family_Name) {
				fullName = fullName + input.Dependent_Family_Name;
			}

			return fullName;
		}
	};
// custom filter
}).filter("concatenateFourPartsDependentNameWithNin", function() {
	return function(inputArr) {
		for(var i = 0 ; i < inputArr.length ; i++){
			var result;
				if (!inputArr[i] ) {
					return ""
				} else {
					result = inputArr[i].Ui_Dependent_Nin +' - ';
					result += inputArr[i].Dependent_First_Name +' ';
					result += inputArr[i].Dependent_Father_Name +' ';
					result += inputArr[i].Dependent_Grandfather_Name + ' ';
					result += inputArr[i].Dependent_Family_Name;
					
					inputArr[i].name = result;
//					(input.Dependent_Nin +' - '+ input.Dependent_First_Name == undefined? "" : input.Dependent_First_Name )+ " " + (input.Dependent_Father_Name == undefined? "" : input.Dependent_Father_Name )+ " " +( input.Dependent_Grandfather_Name == undefined? "" : input.Dependent_Grandfather_Name) + " " + (input.Dependent_Family_Name == undefined? "" : input.Dependent_Family_Name);
				}
		}
		return inputArr;
	};
}).filter("concatenateFourPartsName", function() {
	return function(input) {
		if (!input || !input.firstName) {
			return ""
		} else {
			var fullName = input.firstName + " ";

			if (input.fatherName) {
				fullName = fullName + input.fatherName + " ";
			}

			if (input.grandFatherName) {
				fullName = fullName + input.grandFatherName + " ";
			}

			if (input.familyName) {
				fullName = fullName + input.familyName;
			}

			return input.firstName + " " + input.fatherName + " " + input.grandFatherName + " " + input.familyName;
		}
	};
}).filter("dependentNinToName", function() {
	return function(input , dependentList) {
		for(var i = 0 ; i < dependentList.length ; i++){
			if(input == dependentList[i].Dependent_Nin)
				return dependentList[i].Dependent_First_Name + " " + dependentList[i].Dependent_Father_Name + " " + dependentList[i].Dependent_Grandfather_Name + " " + dependentList[i].Dependent_Family_Name;
		}
	};
}).filter('pagination', function()
		{
	 return function(input, start)
	 {
		 if (!input || !input.length) { return; }
	  start = +start;
	  return input.slice(start);
	 };
});
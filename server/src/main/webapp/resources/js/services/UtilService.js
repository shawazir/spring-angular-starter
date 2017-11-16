angular.module("myApp").factory("UtilService", ["$http", "API_ROOT_URL", function($http, API_ROOT_URL) {
	
	function indexById (list,item) {
		var i = 0;
		var len = list.length;
		for (; i < len; ) { 
			if (list[i].id == item.id) {
				return i;
			}
		    i++;
		}
		return -1;
	};
	
	function existById (list,item) {
		if (indexById(list,item) > -1) {
			return true;
		}
		return false;
	};
	
	return {
		toggleArrayItemById : function(list,item) {
			var index = indexById(list,item);
			if (index > -1) {
				list.splice(index, 1);
			} else {
				list.push(item);
			}
			return list;
		},
		existInListById : function(list,item) {
			return existById(list,item);
		}
	};
	
}]);

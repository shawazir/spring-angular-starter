angular.module("myApp").factory("DynamicPagesService", ["$rootScope", "$http", "$q", "AuthService", "API_ROOT_URL", "REVIEW_TAB_NO", function($rootScope, $http, $q, AuthService, API_ROOT_URL, REVIEW_TAB_NO) {
	$rootScope.tabsDataArray = new Array();

	function assembleTabsDataForReviewTab(tabData, assembledData) {
		var tabDataKeys = Object.keys(tabData);
		for (var i = 0; i < tabDataKeys.length; i++) {
			assembledData[tabDataKeys[i]] = tabData[tabDataKeys[i]];
		}
	}

	function buildServerTabData(tabData) {
		var serverData = new Object();
		var tabDataKeys = Object.keys(tabData);
		for (var i = 0; i < tabDataKeys.length; i++) {
			var clonedTabData = cloneObject(tabData[tabDataKeys[i]]);
			serverData[tabDataKeys[i]] = clonedTabData;

			// Replaces empty String values or white spaces with nulls
			if (clonedTabData.items && clonedTabData.items.length > 0) { // Grid group
				for (var j = 0; j < clonedTabData.items.length; j++) {
					for (var key in clonedTabData.items[j]) {
						var item = clonedTabData.items[j];
						if (item.hasOwnProperty(key)) {
							if (typeof item[key] === "string" && item[key].trim() === "") {
								item[key] = null;
							}
						}
					}
				}
			} else { // Simple group
				for (var key in clonedTabData) {
					if (clonedTabData.hasOwnProperty(key)) {
						if (typeof clonedTabData[key] === "string" && clonedTabData[key].trim() === "") {
							clonedTabData[key] = null;
						}
					}
				}
			}

			// If it's Grid data, nullify 'editableItem'
			if (serverData[tabDataKeys[i]].editableItem !== undefined) {
				serverData[tabDataKeys[i]].editableItem = null;
			}
		}
		return serverData;
	}

	function addEditableItemToGridGroupsData(tabData, defaultTabData) {
		if(tabData==null){
			return;
		}
		var tabDataKeys = Object.keys(tabData);
		for (var i = 0; i < tabDataKeys.length; i++) {
			var isGridGroup = tabData[tabDataKeys[i]].items !== undefined;
			if (isGridGroup) {
				tabData[tabDataKeys[i]].editableItem = cloneObject(defaultTabData[tabDataKeys[i]].editableItem);
			}
		}
	}
	
	function setPersistenceStatusForGridGroupsData(tabData) {
		if(tabData==null){
			return;
		}
		var tabDataKeys = Object.keys(tabData);
		for (var i = 0; i < tabDataKeys.length; i++) {
			var isGridGroup = tabData[tabDataKeys[i]].items !== undefined;
			if (isGridGroup) {
				var items = tabData[tabDataKeys[i]].items;
				for (var j = 0; j < items.length; j++) {
					items[j].transaction_type = $rootScope.cache.enums.PersistenceStatus.NONE;
				}
			}
		}
	}

	function parseArrayValues(tabData) {
		if(tabData==null){
			return;
		}
		var tabDataKeys = Object.keys(tabData);
		for (var i = 0; i < tabDataKeys.length; i++) {
			if (tabData[tabDataKeys[i]].items === undefined) { // Simple group
				var groupData = tabData[tabDataKeys[i]];
				var groupDataKeys = Object.keys(groupData);
				for (var j = 0; j < groupDataKeys.length; j++) {
					var isArrayValue = groupData[groupDataKeys[j]] && typeof(groupData[groupDataKeys[j]]) === "string" && groupData[groupDataKeys[j]].startsWith("array[") && groupData[groupDataKeys[j]].endsWith("]");
					if (isArrayValue) {
						groupData[groupDataKeys[j]] = eval(groupData[groupDataKeys[j]].substring(5));
					}
				}
			} else { // Grid group
				
			}
		}
	}

	/**
	 * Processes fresh data from the server to be used in the controller.
	 * 
	 */
	function processServerTabData(tabNo, data, defaultTabData) {
		addEditableItemToGridGroupsData(data, defaultTabData);
		setPersistenceStatusForGridGroupsData(data);
		parseArrayValues(data);
		$rootScope.tabsDataArray[tabNo - 1] = cloneObject(data);
		return data;
	}

	return {
		doPreLogout: function() {
			$rootScope.tabsDataArray = new Array();
		},
		processServerTabData: function(tabNo, data, defaultTabData) {
			return processServerTabData(tabNo, data, defaultTabData);
		},
		savePageData: function(pageNo, pageData) {
			return $http.post(API_ROOT_URL + "/dynamic-application/" + pageNo, pageData);
		},
		retrievePageData: function(pageNo, defaultPageData) {
			// TODO This line is just a quick filler to get things running
			return $http.get(API_ROOT_URL + "/dynamic-application/" + pageNo);
		},
		saveTabData: function(pageNo, tabNo, tabData , customUrl) {
			var deferred = $q.defer();

			var url = null;
			if (customUrl) {
				url = customUrl;
			} else {
				url = "/dynamic-application/" + pageNo + "/" + tabNo;
			}

			var serverData = buildServerTabData(tabData);
			$http.post(API_ROOT_URL + url, serverData).success(function(data) {
				resetTransactionTypeAndSetIds(tabData, data.value);
				$rootScope.tabsDataArray[tabNo - 1] = cloneObject(tabData); // Caches the tab data
				deferred.resolve(data);
	        }).error(function(data) {
	        	deferred.reject(data);
	        });

			return deferred.promise;
		},
		retrieveTabData: function(pageNo, tabNo, totalTabsCount, defaultTabData, customUrl) {
			var deferred = $q.defer();
			if (tabNo === REVIEW_TAB_NO) { // Review tab
				var tabStatusInfos = this.getWizardProgressInfo().pages[pageNo];
				var assembledData = new Object();
				for (var i = 0; i < tabStatusInfos.length - 1; i++) {
					this.retrieveTabData(pageNo, tabStatusInfos[i].tabNo, totalTabsCount, defaultTabData).then(function(tabData) {
						assembleTabsDataForReviewTab(tabData, assembledData);
					}, function(reason) {
						AlertService.error();
					});
				}
				deferred.resolve(assembledData);
			} else if(tabNo === 600 ){
				var url = null;
				if (customUrl) {
					url = API_ROOT_URL + customUrl;
				} else {
					url = API_ROOT_URL + "/dynamic-application/" + pageNo + "/" + tabNo;
				}

				$http.get(url).success(function(data) {
					processServerTabData(tabNo, data, defaultTabData);
					deferred.resolve(cloneObject(data));
				});
			}else if(tabNo === 200){
				
				var url = null;
				if (customUrl) {
					url = API_ROOT_URL + customUrl;
					$http.get(url).success(function(data) {
						processServerTabData(tabNo, data, defaultTabData);
						deferred.resolve(cloneObject(data));
					});
				} else {
					//do nothing
				}
				
			}else if(tabNo == 700 ){
				//tabNo == 700  --->do nothing ( because the data already retrieved in reviewtab controller by calling ApplicationService.getUploadedFiles()
			}else{
				if ($rootScope.tabsDataArray[tabNo - 1]) {
					deferred.resolve(cloneObject($rootScope.tabsDataArray[tabNo - 1]));
				} else {
					if (this.getTabStatus(pageNo, tabNo) === $rootScope.cache.enums.ApplicantWizardTabStatus.NEW) { // New tab
						deferred.resolve(defaultTabData);
					} else { // Incomplete or Complete tab
						var url = null;
						if (customUrl) {
							url = API_ROOT_URL + customUrl;
						} else {
							url = API_ROOT_URL + "/dynamic-application/" + pageNo + "/" + tabNo;
						}

						$http.get(url).success(function(data) {
							processServerTabData(tabNo, data, defaultTabData);
							deferred.resolve(cloneObject(data));
						});
						// TODO Handle the error in the controller by checking if the returned value of tabsDataArray[tabNo - 1] is undefined
					}
				}
			}
			return deferred.promise;
		},
		completeApplication: function(pageNo, tabNo) {
			var deferred = $q.defer();
			$http.post(API_ROOT_URL + "/dynamic-application/complete-application/" + pageNo + "/" + tabNo, null).success(function(data) {
				deferred.resolve(data);
	        }).error(function(data) {
	        	deferred.reject(data);
	        });
			return deferred.promise;
		},
		getWizardProgressInfo: function() {
			return AuthService.getWizardProgressInfo();
		},
		getLastSavedTabNo: function(pageNo) {
			return AuthService.getWizardProgressInfo().getLastSavedTabNo(pageNo);
		},
		getTabStatus: function(pageNo, tabNo) {
			return AuthService.getWizardProgressInfo().getTabStatus(pageNo, tabNo);
		},
		setTabStatus: function(pageNo, tabNo, newTabStatus) {
			AuthService.getWizardProgressInfo().setTabStatus(pageNo, tabNo, newTabStatus);
		},
		setTabStatusToComplete: function(pageNo, tabNo) {
			var completeTabStatus = $rootScope.cache.enums.ApplicantWizardTabStatus.COMPLETE;
			this.setTabStatus(pageNo, tabNo, completeTabStatus);
		},
		getTabsDataArray: function() {
			return $rootScope.tabsDataArray;
		}
	};
}]);
angular.module("myApp").factory("AuthService", ["$rootScope", "REVIEW_TAB_NO", function($rootScope, REVIEW_TAB_NO) {

	/**
	 * Builds the logged in user object with the given data.
	 * 
	 * @param userData
	 * @returns logged in user object
	 */
	function buildLoggedInUser(userData) {
		buildRoles(userData);
		buildWizardProgressInfo(userData);
		return userData;
	}

	/**
	 * Builds the user roles.
	 * 
	 * @param userData
	 */
	function buildRoles(userData) {
		if (!userData.authorities) {
			return;
		}

		userData.roles = new Array();
		for (var i = 0; i < userData.authorities.length; i++) {
			userData.roles.push(userData.authorities[i].authority);
		}
		delete userData.authorities;
	}

	/**
	 * Builds the wizard progress info.
	 * 
	 * @param userData
	 */
	function buildWizardProgressInfo(userData) {
		if (!userData.wizardProgressInfo) {
			return;
		}

		var wizardProgressInfo = new Object();
		wizardProgressInfo.pages = new Array();

		for (var i = 0; i < userData.wizardProgressInfo.applicantWizardTabsStatusInfos.length; i++) {
			var tabStatusInfo = userData.wizardProgressInfo.applicantWizardTabsStatusInfos[i];
			if (!wizardProgressInfo.pages[tabStatusInfo.pageNo]) {
				wizardProgressInfo.pages[tabStatusInfo.pageNo] = new Array();
			}
			wizardProgressInfo.pages[tabStatusInfo.pageNo][i] = {"tabNo": tabStatusInfo.tabNo, "tabOrder": tabStatusInfo.tabOrder, "tabStatus": getTabStatusId(tabStatusInfo.tabStatus)};
		}

		// Function to find the number of the last saved tab in the given page
		wizardProgressInfo.getLastSavedTabNo = function(pageNo) {
			var wizardTabsStatusArray = this.pages[pageNo];

			for (var i = 0; i < wizardTabsStatusArray.length; i++) {
				var  wizardTabStatus = wizardTabsStatusArray[i];

				var firstTabIsIncomplete = (i === 0) && wizardTabStatus.tabStatus !== $rootScope.cache.enums.ApplicantWizardTabStatus.COMPLETE;
				if (firstTabIsIncomplete) {
					return null;
				}

				var reviewTabIsComplete = wizardTabStatus.tabNo === REVIEW_TAB_NO && wizardTabStatus.tabStatus === $rootScope.cache.enums.ApplicantWizardTabStatus.COMPLETE;
				if (reviewTabIsComplete) {
					return wizardTabStatus.tabNo;
				}

				var otherNonFirstTabIsIncomplete = wizardTabStatus.tabStatus !== $rootScope.cache.enums.ApplicantWizardTabStatus.COMPLETE;
				if (otherNonFirstTabIsIncomplete) {
					return wizardTabsStatusArray[i - 1].tabNo;
				}
			}
		}

		// Function to get the order of the given tab in the given page
		wizardProgressInfo.getTabOrder = function(pageNo, tabNo) {
			var wizardTabsStatusArray = this.pages[pageNo];
			for (var i = 0; i < wizardTabsStatusArray.length; i++) {
				var tabMatch = wizardTabsStatusArray[i].tabNo === tabNo;
				if (tabMatch) {
					return wizardTabsStatusArray[i].tabOrder;
				}
			}
		}

		// Function to get the status of the given tab in the given page
		wizardProgressInfo.getTabStatus = function(pageNo, tabNo) {
			var wizardTabsStatusArray = this.pages[pageNo];
			for (var i = 0; i < wizardTabsStatusArray.length; i++) {
				var tabMatch = wizardTabsStatusArray[i].tabNo === tabNo;
				if (tabMatch) {
					return wizardTabsStatusArray[i].tabStatus;
				}
			}
		}

		// Function to set the status of the given tab in the given page
		wizardProgressInfo.setTabStatus = function(pageNo, tabNo, newTabStatus) {
			var wizardTabsStatusArray = this.pages[pageNo];
			for (var i = 0; i < wizardTabsStatusArray.length; i++) {
				var tabMatch = wizardTabsStatusArray[i].tabNo === tabNo;
				if (tabMatch) {
					wizardTabsStatusArray[i].tabStatus = newTabStatus;
					return;
				}
			}
		}

		// Function to find if the given tab is ready to be saved. That is true if the order of the given tab is one step after the last saved tab.
		wizardProgressInfo.isTabReadyToBeSaved = function(pageNo, tabNo) {
			var wizardTabsStatusArray = this.pages[pageNo];
			for (var i = 0; i < wizardTabsStatusArray.length; i++) {
				var tabMatch = wizardTabsStatusArray[i].tabNo === tabNo;
				if (tabMatch) {
					if (i === 0) { // First tab
						return true;
					} else {
						var previousTabIsComplete = wizardTabsStatusArray[i - 1].tabStatus === $rootScope.cache.enums.ApplicantWizardTabStatus.COMPLETE;
						if (previousTabIsComplete) {
							return true;
						} else {
							return false;
						}
					}
				}
			}
			throw "Tab not found";
		}

		userData.wizardProgressInfo = wizardProgressInfo;
	}

	/**
	 * Gets the id of the given tab status enum.
	 * 
	 * @param tabStatusCode
	 */
	function getTabStatusId(tabStatusCode) {
		return $rootScope.cache.enums.ApplicantWizardTabStatus[tabStatusCode];
	}

	/**
	 * Finds if the user has the given role.
	 * 
	 */
	function hasRole(roleName) {
		return hasRoleInArray(roleName, $rootScope.loggedInUser.roles);
	}

	/**
	 * Finds if the given role exists in the given array.
	 * 
	 */
	function hasRoleInArray(roleName, rolesArray) {
		for (var i = 0; i < rolesArray.length; i++) {
			if (rolesArray[i] === roleName) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Finds if the user has any of the given roles.
	 * 
	 */
	function hasAnyRole(roleNames) {
		for (var i = 0; i < roleNames.length; i++) {
			if (hasRole(roleNames[i])) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * clears all eligibility data
	 */
	function clearEligibilityData() {
		$rootScope.applicantDependentsEligibilityInfo = undefined;
		$rootScope.applicantEligibilityInfo = undefined;
		$rootScope.applicantIneligibilityReasons =undefined;
	}

	return {
		getUser: function() {
			return $rootScope.loggedInUser;
		},
		setUser: function(userData) {
			var user = buildLoggedInUser(userData);
			if (user.otpActive === true) {
				$rootScope.loggedIn = false;
			} else {
				$rootScope.loggedIn = true;
			}
			$rootScope.loggedInUser = user;
		},
		nullifyUser: function() {
			$rootScope.loggedIn = false;
			$rootScope.loggedInUser = null;
			clearEligibilityData();
		},
		hasRole: function(roleName) {
			return hasRole(roleName);
		},
		hasAnyRole: function(roleNames) {
			return hasAnyRole(roleNames);
		},
		getWizardProgressInfo: function(pageNo) {
			return $rootScope.loggedInUser.wizardProgressInfo;
		}
	};
}]);
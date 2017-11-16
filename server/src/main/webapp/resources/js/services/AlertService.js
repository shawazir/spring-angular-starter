angular.module("myApp").factory("AlertService", ["$rootScope", "$timeout" , "$window" , "$location" , function($rootScope, $timeout ,$window , $location) {

	var ALERT_DELAY = 15000;

	function showAlert(scope, alertType, alertMsg, keepAlert, lifespan) {
		scope = $rootScope; // TODO Refactor this
		if (!lifespan) {
			lifespan = 0;
		}
		if (!scope.alerts) {
			scope.alerts = new Array();
		}
		var alertId = Math.floor((Math.random() * 10000) + 1);
		scope.alerts.push({id: alertId, type: alertType, msg: alertMsg, lifespan: lifespan});
		var alertDelay = ALERT_DELAY;
		if(alertMsg && alertMsg.length>75){
			alertDelay = alertDelay*2;
		}
		if (!keepAlert) {
			$timeout(function() {
				removeAlert(alertId, scope.alerts)
			}, alertDelay);
		}
		$window.scrollTo(0, 0);
	}

	function showFloatingAlert(scope, alertType, alertMsg, keepAlert) {
		if (!scope.floatingAlerts) {
			scope.floatingAlerts = new Array();
		}
		var alertId = Math.floor((Math.random() * 10000) + 1);
		scope.floatingAlerts.push({id: alertId, type: alertType, msg: alertMsg});
		if (!keepAlert) {
			$timeout(function() {
				removeAlert(alertId, scope.floatingAlerts)
			}, ALERT_DELAY);
		}
		//$window.scrollTo(0, 0);
	}

	function removeAlert(alertId, alertsList) {
		for (var i = 0; i < alertsList.length; i++) {
			if (alertsList[i].id === alertId) {
				alertsList.splice(i, 1);
			}
		}
	}

	return {
		success: function(scope, alertMsg, keepAlert) {
			showAlert(scope, "success", alertMsg, keepAlert);
		},
		successf: function(scope, alertMsg, keepAlert) {
			showFloatingAlert(scope, "success", alertMsg, keepAlert);
		},
		info: function(scope, alertMsg, keepAlert) {
			showAlert(scope, "info", alertMsg, keepAlert);
		},
		infof: function(scope, alertMsg, keepAlert) {
			showFloatingAlert(scope, "info", alertMsg, keepAlert);
		},
		warning: function(scope, alertMsg, keepAlert) {
			showAlert(scope, "warning", alertMsg, keepAlert);
		},
		warningf: function(scope, alertMsg, keepAlert) {
			showFloatingAlert(scope, "warning", alertMsg, keepAlert);
		},
		error: function(scope, alertMsg, keepAlert) {
			if (!alertMsg) {
				alertMsg = "حدث خطأ، يرجى المحاولة لاحقاً";
			}
			showAlert(scope, "danger", alertMsg, keepAlert);
		},
		errorf: function(scope, alertMsg, keepAlert) {
			if (!alertMsg) {
				alertMsg = "حدث خطأ، يرجى المحاولة لاحقاً";
			}
			showFloatingAlert(scope, "danger", alertMsg, keepAlert);
		},
		roamingAlert: function(alertType, alertMsg, keepAlert) {
			showAlert($rootScope, alertType, alertMsg, keepAlert, 1);
		}
	};
}]);

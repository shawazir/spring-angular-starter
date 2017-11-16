angular.module("myApp").factory("TimeoutService", ["$location" , "$timeout" ,"$rootScope" , "GenCacheService" , "AuthService" , "API_ROOT_URL" , function($location , $timeout ,$rootScope , GenCacheService , AuthService , API_ROOT_URL) {
	var timeout = undefined;
	var warningTimeout = undefined;
	var DEFAULT_TIME = GenCacheService.getCache().portalSessionTimeoutDestruction * 1000;
	DEFAULT_TIME = DEFAULT_TIME - 7000;//before the session ends by 7 seconds
	var WARNING_DEFAULT_TIME = GenCacheService.getCache().portalSessionTimeoutWarning * 1000;
	var modalId = "modal-" + Math.floor((Math.random() * 10000) + 1);
	
	/**
	 * Builds the TimeOut objects and start the timeout with the given data.
	 * @param isKeepAliveNeeded
	 * 
	 */
	function buildTimeOut(isKeepAliveNeeded) {
		$timeout.cancel(warningTimeout);
		$timeout.cancel(timeout);
		warningTimeout =  $timeout(function(){ showAlertToUser() }, WARNING_DEFAULT_TIME);
		timeout = $timeout(function(){ loguot() }, DEFAULT_TIME);
		if(isKeepAliveNeeded){
			keepAlive("/keep-alive" , false);
		}
	}
	
	/**
	 * Restart the TimeOut objects to extend the session.
	 * @param isKeepAliveNeeded
	 * 
	 */
	function restartTimeout(isKeepAliveNeeded){
		
		buildTimeOut(isKeepAliveNeeded);
	}
	
	/**
	 * Stop the TimeOut objects from extend the session.
	 * 
	 */
	function stopTimeout(){
		$timeout.cancel(warningTimeout);
		$timeout.cancel(timeout);
	}
	
	function showAlertToUser(){
		var msg = "سيتم إغلاق النظام هل تود الإستمرار ؟";
		var modalHtml = "<div id='" + modalId + "' class='modal fade' tabindex='-1' role='dialog'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h4 class='modal-title'>تأكيد</h4></div><div class='modal-body'><p>" + msg + "</p></div><div class='modal-footer'><button type='button' class='btn btn-default close-btn' data-dismiss='modal'>لا</button><button type='button' class='btn btn-primary ok-btn'>نعم</button></div></div></div></div>";

		$("[ng-view]").append(modalHtml);
		$("#" + modalId).modal("show").find(".modal-dialog").css({'margin-top': function() {
			return ($(window).height()/ 2) - 300;
		}});
		
		$("#" + modalId + " .ok-btn").bind("click", function() {
			$("#" + modalId).modal("hide");
			keepAlive("/logged-in-user" , true);
		});
		
		$("#" + modalId + " .close-btn").bind("click", function() {
			loguot();
		});
	}
	
	function loguot(){
		if(AuthService.getUser() !== undefined && AuthService.getUser() !== null){
			$("#" + modalId).modal("hide");
			$location.path("/logout");
			$rootScope.$apply();	
		}
	}
	
	
	function keepAlive(url , needRestart){
		$.ajax({url: API_ROOT_URL + url , 
			success: function(result){
				if(needRestart){
					restartTimeout();
					$rootScope.$apply();	
				}
			},
		    error: function(){
				loguot();
	        }
		});
	}

	return {
		buildTimeOut: function() {
			buildTimeOut(false);
		},
		restartTimeout: function(isKeepAliveNeeded) {
			restartTimeout(isKeepAliveNeeded);
		},
		stopTimeout : function(){
			stopTimeout();
		}
	};
}]);
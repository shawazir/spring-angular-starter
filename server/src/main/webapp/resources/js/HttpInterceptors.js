var NUMBER_OF_REQUESTS_UNDER_PROCESS = 0 ;

myApp.config([ "$httpProvider", function($httpProvider) {
	/**
	 * catch the $http request and detect whether timeout need to be reset or not.
	 * and show the processing icon when there is a pending request
	 * @param TimeoutService
	 * @param AuthService
	 * @param $rootScope
	 */
	$httpProvider.interceptors.push(['$q', 'TimeoutService', 'AuthService',"$rootScope", function($q,TimeoutService, AuthService,$rootScope) {
		  return {
		   'request': function(config) {
				if(NUMBER_OF_REQUESTS_UNDER_PROCESS === 0){
					$rootScope.showMask = true;
				}
				NUMBER_OF_REQUESTS_UNDER_PROCESS++;
				if (AuthService.getUser() !== undefined && AuthService.getUser() !== null && AuthService.getUser().otpActive === false) {
					TimeoutService.restartTimeout(false);
				} else {
					TimeoutService.stopTimeout();
				}
				return config;
			},
			'requestError': function(rejection) {
				NUMBER_OF_REQUESTS_UNDER_PROCESS--;
				if(NUMBER_OF_REQUESTS_UNDER_PROCESS === 0){
					$rootScope.showMask = false;
				}
			      return $q.reject(rejection);
			}, 
		    'response': function(response) {
		    	NUMBER_OF_REQUESTS_UNDER_PROCESS--;
				if(NUMBER_OF_REQUESTS_UNDER_PROCESS === 0){
					$rootScope.showMask = false;
				}
				return response;
			},
			'responseError': function(rejection) {
			    	NUMBER_OF_REQUESTS_UNDER_PROCESS--;
					if(NUMBER_OF_REQUESTS_UNDER_PROCESS === 0){
						$rootScope.showMask = false;
					}
					return $q.reject(rejection);
				}
		  };
		}]);
}]);

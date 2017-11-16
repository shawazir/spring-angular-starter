/***
 * modelConfig is configuration object used to set the model properties. 	
 * @param {Object} modelConfig
 * @param {function} successCallback The callback function
 * @param {function} failureCallBack The callback function
 * @param {Integer} modelConfig.timeout milliseconds <p>default is 0 which will be ignored </p>
 * @param {String} modelConfig.title
 * @param {String} modelConfig.message
 * @param {boolean} modelConfig.static <p>indicate whether the model are dismissible on click or not; default is <h4>static</h4> </p>
 * @param {boolean} modelConfig.rejectButtonActive <p>default is true </p>
 * @param {boolean} modelConfig.acceptButtonActive <p>default is true </p>
 * @param {String} modelConfig.rejectButtonLable <p>default is لا </p>
 * @param {String} modelConfig.acceptButtonLable <p>default is نعم </p>
 * @param {String} modelConfig.redirectPathOnSuccess <p>use $location</p>
 * @param {String} modelConfig.redirectPathOnFailure <p>use $location</p>
 * 
 */
angular.module("myApp").factory("ModalService", ["$location" , "$timeout" ,"$rootScope" , "AuthService" , "API_ROOT_URL" , function($location , $timeout ,$rootScope , AuthService , API_ROOT_URL) {
	var timeout = undefined;
	var modalId = "modal-" + Math.floor((Math.random() * 10000) + 1);
	
	/**
	 * Builds the model template and show the model.
	 * @param {Object} modelConfig
	 * @param {function} successCallback The callback function
	 * @param {function} failureCallBack The callback function
	 * 
	 */
	function buildModel(config, successCallBack , failureCallBack) {
		modelConfig = bulidConfigObject(config)
		if(modelConfig.timeout != 0){
			$timeout(function(){ hideModel() }, modelConfig.timeout);
		}
		
		var modalHtml = "<div id='" + modalId + "' class='modal fade' tabindex='-1' role='dialog' aria-hidden='true' data-backdrop='" + modelConfig.static + "' data-keyboard='" + modelConfig.static + "'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h4 class='modal-title'>" + modelConfig.title +"</h4></div><div class='modal-body'><p>" + modelConfig.message + "</p></div><div class='modal-footer'><button id='btn-" + modalId + "' type='button' class='col-xs-12 col-sm-4 btn btn-default close-btn' data-dismiss='modal'>" + modelConfig.rejectButtonLable + "</button><button id='btn-" + modalId + "' type='button' class='col-xs-12 col-sm-7 col-md-5 btn btn-primary ok-btn'>" + modelConfig.acceptButtonLable + "</button></div></div></div></div>";

		$("#content-area").append(modalHtml);
		$("#" + modalId).modal("show").find(".modal-dialog").css({'margin-top': function() {
			return ($(window).height()/ 2) - 300;
		}});
		
		if(!modelConfig.rejectButtonActive){
			$("#btnReject-" + modalId).hide();
		}
		
		if(!modelConfig.acceptButtonActive){
			$("#btnAccept-" + modalId).hide();
		}
		
		$("#" + modalId + " .ok-btn").bind("click", function() {
			$("#" + modalId).modal("hide");
			if(modelConfig.redirectPathOnSuccess != null){
				$location.path(modelConfig.redirectPathOnSuccess);
			}
			$rootScope.$apply();
			if (typeof successCallBack === "function") {
				successCallBack();
			}
		});
		
		$("#" + modalId + " .close-btn").bind("click", function() {
			$("#" + modalId).modal("hide");
			if(modelConfig.redirectPathOnFailure != null){
				$location.path(modelConfig.redirectPathOnFailure);
			}
			$rootScope.$apply();
			if (typeof failureCallBack === "function") {
				failureCallBack();
			}
		});		
		
	}
	
	/**
	 * Hide model when timeout is finished.
	 * 
	 */
	function hideModel(){
		$("#" + modalId).modal("hide");
		$rootScope.$apply();
	}
	
	/**
	 * Construct model configuration object and set default values in failure.
	 * @param modelConfig
	 * 
	 */
	function bulidConfigObject(modelConfig){
		return returnConfig = {
				timeout : modelConfig.timeout != null ||  modelConfig.timeout != undefined ? modelConfig.timeout : 0,
				title : modelConfig.title,
				message : modelConfig.message,
				static : modelConfig.static != null || modelConfig.static != undefined ? modelConfig.static :"static",
				rejectButtonActive : modelConfig.rejectButtonActive != null || modelConfig.rejectButtonActive != undefined ? modelConfig.rejectButtonActive : false,
				acceptButtonActive : modelConfig.acceptButtonActive != null || modelConfig.acceptButtonActive != undefined ? modelConfig.acceptButtonActive :true,
				rejectButtonLable : modelConfig.rejectButtonLable,
				acceptButtonLable : modelConfig.acceptButtonLable != null ||  modelConfig.acceptButtonLable != undefined ? modelConfig.acceptButtonLable : "نعم",
				redirectPathOnSuccess : modelConfig.redirectPathOnSuccess != null ||  modelConfig.redirectPathOnSuccess != undefined ? modelConfig.redirectPathOnSuccess : null,
				redirectPathOnFailure : modelConfig.redirectPathOnFailure != null ||  modelConfig.redirectPathOnFailure != undefined ? modelConfig.redirectPathOnFailure : null
		};

	}	
	

	return {
		buildModel: function(modelConfig , successCallBack , failureCallBack) {
			return buildModel(modelConfig ,  successCallBack , failureCallBack);
		},
	};
}]);
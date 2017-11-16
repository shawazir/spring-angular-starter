var initialized = false;
myApp.controller('MarkerCtrl', ['$scope', '$element', '_', function($scope, $element, _) {
    var vm = this;
    vm.scope = $scope;
    vm.element = $element.parent();
    vm.dataElement = vm.element.attr('ng-model');
    
    $scope.$on('mapInitialized', function(event, evtMap) {

    	initialized  = true;
    	
        vm.MapData = _.get($scope.$parent.$parent, vm.dataElement);
	    if (vm.MapData)
	    {		
	    	var cordinate = angular.fromJson(vm.MapData);
	    	$scope.positions = cordinate;
	    	evtMap.setCenter(cordinate);
	    	evtMap.markers.marker.visiable = true;
	    	evtMap.markers.marker.setPosition(cordinate);
	    	evtMap.setZoom(13);
	    }
	    else
	    {
	    	var defaultCoordinate = new Object();
	    	defaultCoordinate.lat = 24.395882;
	    	defaultCoordinate.lng = 45.021973;
	    	
	    	evtMap.setCenter(defaultCoordinate);
	    	evtMap.setZoom(5);
	    	evtMap.markers.marker.visiable = false;
	    }
	    
      });
    
    vm.addMarker = function(event) {
      var ll = event.latLng;
      var cordinate = {lat:ll.lat(), lng: ll.lng()};
      $scope.positions = cordinate;
      _.set(vm.scope.$parent.$parent, vm.dataElement, JSON.stringify(cordinate)); 
    };
  }]);



//ng-if="positions.lat"  
angular.module("myApp").directive("googlemap", function() {
	return {
		restrict: "EA",
        scope: {
	         region: '@',
	         city : '@',
	         neighbourhood : '@'
	      },
		template : '<div ng-controller = "MarkerCtrl as vm"><ng-map zoom="{{zoom}}" center="{{point | regionFilter}}" on-click="vm.addMarker()"> <marker id="marker" position="{{positions.lat}}, {{positions.lng}}"></marker> </ng-map></div>',
		link: function(scope, element, attributes){
			
			var self = this;
			scope.$watch('region', function (newValue, oldValue) {
				
				if (oldValue == ''  && initialized == false)
				{
					return;
				}
			
				if (newValue && newValue != "")	
				    {	
				    	scope.point = newValue;
				    	scope.zoom = 11;
				    }
			});
			   
			/*
			 * city and neighbourhood selection are disabled
			scope.$watch('city', function (newValue, oldValue) {
				if (!scope.regionSelected) return;
			
				if (newValue && newValue != "")	
				    {
				    	scope.point = newValue;
				    	scope.citySelected = true;
				    }
			});

			scope.$watch('neighbourhood', function (newValue, oldValue) {
				if (!scope.citySelected) return;
			
				if (newValue && newValue != "")	
					scope.point = newValue;
			});
			*/
		}  
	};
});
var notificationControllers = angular.module("notificationControllers", []);

notificationControllers.controller("notificationController", [ "$scope", "NotificationService","$rootScope",
		function($scope, NotificationService,$rootScope) {
			$scope.allMessages = {};
			$scope.notification = {};
			NotificationService.getAllNotifications().success(function(data) {
				$scope.allNotifications = data.value.notfications;
				$rootScope.loggedInUser.unreadNotificationCount = getNumberOfUnreadNotification($scope.allNotifications);
			}).error(function() {

			});

			$scope.setNotRead = function(isPending) {
				if (isPending) {
					return {
						fontWeight : "bold"
					}
				}
			};

			// open the popup window
			$scope.open = function(notification) {
				$scope.notification = notification;
				NotificationService.updateNotification(notification.notificationId).success(function(data) {
					$scope.allNotifications = data.value.notfications;
					$rootScope.loggedInUser.unreadNotificationCount = getNumberOfUnreadNotification($scope.allNotifications);
				}).error(function() {

				});
				$scope.showModal = true;
				
				$("#profile").find(".modal-dialog").css({'margin-top': function() {
					return ($(window).height()/ 2) - 250;
				}});
			};
			
			// close the popup window
			$scope.cancel = function() {
				$scope.notification = {};
				$scope.showModal = false;
			};
			
			
			//function to get number of unread notifications
			getNumberOfUnreadNotification = function(notifications){
				var numberOfUnreadNotification = 0;
				for (var i in notifications) {
					if(notifications[i].isPending){
						numberOfUnreadNotification++ ;
					}
				}
				return numberOfUnreadNotification;
			}

		} ]);

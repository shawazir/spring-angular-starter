Array.prototype.contains = function (obj) {
   for (i in this) {
       if (this[i] == obj) {
    	   return true;
       }
   }
   return false;
};

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(searchString, position) {
		position = position || 0;
		return this.indexOf(searchString, position) === position;
	};
}

/**
 * Toggles the given item; adds it to the array if not present, otherwise removes it.
 * 
 * @param array
 * @param item
 */
function toggleArrayItem(array, item) {
	var index = array.indexOf(item);

	if (index > -1) {
		array.splice(index, 1);
	} else {
		array.push(item);
	}
}

var isMobile = {
	Android : function() {
		return !!navigator.userAgent.match(/Android/i);
	},
	BlackBerry : function() {
		return !!navigator.userAgent.match(/BlackBerry/i);
	},
	iOS : function() {
		return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera : function() {
		return !!navigator.userAgent.match(/Opera Mini/i);
	},
	Windows : function() {
		return !!navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
	},
	any : function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() || false);
	}
};

/**
 * Adds newly created item to the items list of a grid group.
 * 
 * @param groupData
 */
function addNewItemToItemsList(groupData) {
	var newItem = groupData.editableItem.data;
	newItem.transaction_type = 1;
	groupData.items.push(newItem);
	resetEditableItem(groupData.editableItem);
	groupData.showAddForm = false;
}

/**
 * Prepares an existing item of a grid group for editing by cloning it and adding the cloned to editableItem.
 * 
 * @param groupData
 * @param index
 */
function prepareItemForEditing(groupData, index) {
	var itemToBeEdited = cloneObject(groupData.items[index]);
	var referenceData = groupData.editableItem.referenceData;
	groupData.editableItem = makeEditableItemFromExistingItem(index, itemToBeEdited, referenceData);
	groupData.showAddForm = true;
}

/**
 * Applies the edit which was done to editableItem.
 * 
 * @param groupData
 */
function applyEdit(groupData) {
	var editedItem = groupData.editableItem.data;
	var index = groupData.editableItem.index;

	var isItemNew = groupData.items[index].transaction_type == 1;
	if (!isItemNew) {
		editedItem.transaction_type = 2;
	}

	groupData.items.splice(index, 1, editedItem);
	resetEditableItem(groupData.editableItem);
	groupData.showAddForm = false;
}

/**
 * Cancels the edit which was done to editableItem.
 * 
 * @param groupData
 */
function cancelEdit(groupData) {
	resetEditableItem(groupData.editableItem);
	groupData.showAddForm = false;
}

/**
 * Removes an item of a grid group.
 * 
 * @param groupData
 * @param index
 */
function removeItem(groupData, index) {
	var removedItem = groupData.items[index];
	if(removedItem.transaction_type == 1){
		groupData.items.splice(index, 1);
		return;
	}
	removedItem.transaction_type = 3;
	if (!groupData.removedItems) {
		groupData.removedItems = new Array();
	}
	groupData.removedItems.push(removedItem);

	groupData.items.splice(index, 1);
	resetEditableItem(groupData.editableItem);
}

function resetTransactionTypeAndSetIds(groupsData, componentsGroupsGeneratedIds) {
	var groupNumbers = Object.keys(componentsGroupsGeneratedIds);
	for (var i = 0; i < groupNumbers.length; i++) {
		var groupName;
		if(groupNumbers[i].indexOf("group")<0)
			groupName= "group" + groupNumbers[i];
		else
			groupName= groupNumbers[i];
		var group = groupsData[groupName];
		if(groupName !=='group9'){
		var isGridGroup = !!group.items;
		var groupIds = componentsGroupsGeneratedIds[groupNumbers[i]];
		
		if (!isGridGroup) {
			group.ID = groupIds[0];
		} else {
			for (var j = 0; j < groupIds.length; j++) {
				for (var k = 0; k < group.items.length; k++) {
					if (group.items[k].transaction_type == 1) {
						group.items[k].transaction_type = 0;
						group.items[k].ID = groupIds[j] + "";
						break;
					}
					group.items[k].transaction_type = 0;
				}
			}
			
		}
		}
	}
}

/**
 * Resets the values of the given editableItem.
 * 
 * @param editableItem
 */
function resetEditableItem(editableItem) {
	editableItem.index = -1;
	editableItem.data = cloneObject(editableItem.referenceData);
}

/**
 * Makes an editableItem with the values of the given existingItem.
 * 
 * @param index
 * @param existingItem
 * @param referenceData
 */
function makeEditableItemFromExistingItem(index, existingItem, referenceData) {
	var item = new Object();
	item.index = index;
	item.data = existingItem;
	item.referenceData = referenceData;
	return item;
}

/**
 * Prevents skipping an incomplete tab by redirecting the user to it.
 * 
 * @param pageNo
 * @param tabNo
 * @param pagePath
 * @param DynamicPagesService
 * @param $location
 */
function preventSkippingIncompleteTab(pageNo, tabNo, pagePath, DynamicPagesService, $location) {
	var wizardProgressInfo = DynamicPagesService.getWizardProgressInfo();
	var tabIsReadyToBeSaved = wizardProgressInfo.isTabReadyToBeSaved(pageNo, tabNo);
	if (!tabIsReadyToBeSaved) {
		var lastSavedTabNo = DynamicPagesService.getLastSavedTabNo(pageNo);
		var lastSavedTabOrder = wizardProgressInfo.getTabOrder(pageNo, lastSavedTabNo);
		if (lastSavedTabNo != null) {
			$location.path("/" + pagePath + "/" + (lastSavedTabOrder + 1));
		} else {
			$location.path("/" + pagePath + "/" + (1));
		}
	}
}

/**
 * Checks if the data in a tab has been changed in comparison with the data that is cached in the service.
 * 
 * @param tabNo
 * @param tabData
 * @param allTabsDataArray
 * @returns {Boolean}
 */
function checkIfTabDataChanged(tabNo, tabData, allTabsDataArray) {
	if (allTabsDataArray[tabNo - 1]) {
		var currentTabDataString = JSON.stringify(allTabsDataArray[tabNo - 1]);
		var newTabDataString = JSON.stringify(tabData);
		if (currentTabDataString === newTabDataString) {
			return false;
		} else {
			return true;
		}
	} else {
		return true;
	}
}

/**
 * Clones an object on the first level only.
 * 
 * @param object
 */
function cloneObject(object) {
	var clonedObject = jQuery.extend(true, {}, object);
	return clonedObject;
}

/**
 * Pads the given number with zeros.
 *  
 * @param num
 * @param paddingSize
 */
function padNumber(num, paddingSize) {
	var numString = num + "";
	while (numString.length < paddingSize) {
		numString = "0" + numString;
	}
	return numString;
}

/**
 * Finds if the given string is an integer number.
 * 
 * @param num
 */
function isInteger(num) {
	if (num === undefined || num === null || num.trim() === "") {
		return false;
	}

	var charCode;
	var charIsNotDigit;
	var charIsNotSmallLetter;
	for (var i = 0; i < num.length; i++) {
		charCode = num.charCodeAt(i);
		charIsNotDigit = (charCode < 48 || charCode > 57);
		if (charIsNotDigit) {
			return false;
		}
	}
	return true;
}

/**
 * Parses the given integer number; if not integer, returns null.
 * 
 * @param num
 */
function parseInteger(num) {
	if (isInteger(num)) {
		return parseInt(num);
	} else {
		return null;
	}
}

/**
 * Check if today is after one day from entered date.
 * 
 * @param date as number 
 */
function isAfterOneDay(dateNumber) {
	 if(new Date() > new Date((new Date(dateNumber)).valueOf() + 1000*3600*24)){
		 return true;
	 }else{
		 return false;
	 }
}

/**
 * Prevents pasting inside elements with the class "no-paste".
 * 
 */
$(document).on('paste', '.no-paste', function(event) {
	event.preventDefault();
});

/**
 * Removes non-numeric characters from elements with the class "numeric" on keyup and blur events.
 * 
 */
$(document).on('keyup blur', '.numeric', function(event) {
	if (this.value != this.value.replace(/[^0-9]/g, '')) {
		this.value = this.value.replace(/[^0-9]/g, '');
		$(this).trigger("change");
	}
});

/**
 * Removes spaces from elements with the class "no-spaces" on keyup and blur events.
 * 
 */
$(document).on('keyup blur', '.no-spaces', function(event) {
	this.value = this.value.replace(/\s/g, '');
});

/**
 * Zoom in binder.
 * 
 */
function bindeZoomInAndOut() {
	if ($(".na-page-actions").length > 0) { 
	    $(".na-page-actions .font-minus").click(function(){
	    	var size = parseInt($('body .container .inner-content *').css('font-size'))
	    	$('body .container .inner-content *').css('font-size', size / 1.3)
	    });    
	    $(".na-page-actions .font-plus").click(function(){
	    	var size = parseInt($('body .container .inner-content *').css('font-size'))
	        $('body .container .inner-content *').css('font-size', size * 1.3)
	    });     
	} 
}
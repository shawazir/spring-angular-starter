angular.module("myApp").directive("myPaginator",  function() {
	return {
		restrict: "EA",
		link : function(scope, element, attrs) {

			var size = undefined;
			var total = undefined;
			var current = undefined;
			var url = undefined;

			attrs.$observe("myPaginatorSize", function(value){
				size = parseInt(value);
				if (isAttrsAvailable()) {
					buildPagination();
				}
			});

			attrs.$observe("myPaginatorTotal", function(value){
				total = parseInt(value);
				if (isAttrsAvailable()) {
					buildPagination();
				}
			});

			attrs.$observe("myPaginatorCurrent", function(value){
				current = parseInt(value);
				if (isAttrsAvailable()) {
					buildPagination();
				}
			});

			attrs.$observe("myPaginatorUrl", function(value){
				url = value;
				if (isAttrsAvailable()) {
					buildPagination();
				}
			});

			function isAttrsAvailable() {
				if (angular.isNumber(size) && !isNaN(size) && angular.isNumber(total) && !isNaN(total) && angular.isNumber(current) && !isNaN(current) && angular.isString(url)) {
					return true;
				} else {
					return false;
				}
			}
			
			
			function setSelectedPage(current, index){
				if (current == index){
					return " class='active'";
				}else{
					return '';
				}
			}

			function buildPagination() {
				var outputHtml = "";
				

				var pages = Math.ceil(total / size);
				if (pages <= 1) {
					element.html("<li class='active'><span>1</span></li>");
				} else if(pages > 10){ // start of huge pagination 
					
					if (current > 1) {
						outputHtml = outputHtml + "<li><a class='next-page' href='" + url + 1 + "'> << </a></li>";
						outputHtml = outputHtml + "<li><a class='next-page' href='" + url + (current - 1) + "'>السابق</a></li>";
					} else {
						outputHtml = outputHtml + "<li><span>السابق</span></li>";
					}
					
					if((current >= 5) && (pages - current > 3 )){
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , 1) + " ><a href=" + url + 1 + ">" + 1 + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , 2) + " ><a href=" + url + 2 + ">" + 2 + "</a></li>";
						outputHtml = outputHtml  + "<li class='ng-scope disabled'><a>" + "..." + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) - parseInt(2))) + " ><a href=" + url + parseInt(parseInt(current) - parseInt(2)) + ">" +parseInt(parseInt(current) - parseInt(2)) + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) - parseInt(1))) + " ><a href=" + url + parseInt(parseInt(current) - parseInt(1)) + ">" +parseInt(parseInt(current) - parseInt(1)) + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current))) + " ><a href=" + url + parseInt(parseInt(current)) + ">" +parseInt(parseInt(current)) + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) + parseInt(1))) + " ><a href=" + url + parseInt(parseInt(current) + parseInt(1)) + ">" +parseInt(parseInt(current) + parseInt(1)) + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) + parseInt(2))) + " ><a href=" + url + parseInt(parseInt(current) + parseInt(2)) + ">" +parseInt(parseInt(current) + parseInt(2)) + "</a></li>";
						if ((pages - current) != 4 ){
							outputHtml = outputHtml  + "<li class='ng-scope disabled'><a>" + "..." + "</a></li>";
						}
					}else if((current >= 5) &&  (pages - current ) < 4  && (pages - current ) >= 2){
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , 1) + " ><a href=" + url + 1 + ">" + 1 + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , 2) + " ><a href=" + url + 2 + ">" + 2 + "</a></li>";
						outputHtml = outputHtml  + "<li class='ng-scope disabled'><a>" + "..." + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) - parseInt(2))) + " ><a href=" + url + parseInt(parseInt(current) - parseInt(2)) + ">" +parseInt(parseInt(current) - parseInt(2)) + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) - parseInt(1))) + " ><a href=" + url + parseInt(parseInt(current) - parseInt(1)) + ">" +parseInt(parseInt(current) - parseInt(1)) + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current))) + " ><a href=" + url + parseInt(parseInt(current)) + ">" +parseInt(parseInt(current)) + "</a></li>";
						if(pages - current == 3){
							outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) + parseInt(1))) + " ><a href=" + url + parseInt(parseInt(current) + parseInt(1)) + ">" +parseInt(parseInt(current) + parseInt(1)) + "</a></li>";
						}

					}else if(current == pages - 1){
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , 1) + " ><a href=" + url + 1 + ">" + 1 + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , 2) + " ><a href=" + url + 2 + ">" + 2 + "</a></li>";
						outputHtml = outputHtml  + "<li class='ng-scope disabled'><a>" + "..." + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) - parseInt(3))) + " ><a href=" + url + parseInt(parseInt(current) - parseInt(3)) + ">" +parseInt(parseInt(current) - parseInt(3)) + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) - parseInt(2))) + " ><a href=" + url + parseInt(parseInt(current) - parseInt(2)) + ">" +parseInt(parseInt(current) - parseInt(2)) + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) - parseInt(1))) + " ><a href=" + url + parseInt(parseInt(current) - parseInt(1)) + ">" +parseInt(parseInt(current) - parseInt(1)) + "</a></li>";
					}else if(current == pages ){
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , 1) + " ><a href=" + url + 1 + ">" + 1 + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , 2) + " ><a href=" + url + 2 + ">" + 2 + "</a></li>";
						outputHtml = outputHtml  + "<li class='ng-scope disabled'><a>" + "..." + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) - parseInt(4))) + " ><a href=" + url + parseInt(parseInt(current) - parseInt(4)) + ">" +parseInt(parseInt(current) - parseInt(4)) + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) - parseInt(3))) + " ><a href=" + url + parseInt(parseInt(current) - parseInt(3)) + ">" +parseInt(parseInt(current) - parseInt(3)) + "</a></li>";
						outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(current) - parseInt(2))) + " ><a href=" + url + parseInt(parseInt(current) - parseInt(2)) + ">" +parseInt(parseInt(current) - parseInt(2)) + "</a></li>";
					}else{
						outputHtml = outputHtml  + "<li" +  setSelectedPage(current , 1) + " ><a href=" + url + 1 + ">" + 1 + "</a></li>";
						outputHtml = outputHtml  + "<li" +  setSelectedPage(current , 2) + " ><a href=" + url + 2 + ">" + 2 + "</a></li>";
						outputHtml = outputHtml  + "<li" +  setSelectedPage(current , 3) +" ><a href=" + url + 3 + ">" + 3 + "</a></li>";
						outputHtml = outputHtml  + "<li" +  setSelectedPage(current , 4) +" ><a href=" + url + 4 + ">" + 4 + "</a></li>";
						outputHtml = outputHtml  + "<li" +  setSelectedPage(current , 5) +" ><a href=" + url + 5 + ">" + 5 + "</a></li>";
						outputHtml = outputHtml  + "<li class='ng-scope disabled'><a>" + "..." + "</a></li>";
					}
					
					
					if(current != pages || current != pages -1){
					outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(parseInt(pages) - parseInt(1))) + "><a href=" + url + parseInt(parseInt(pages) - parseInt(1)) + ">" +parseInt(parseInt(pages) - parseInt(1)) + "</a></li>";
					outputHtml = outputHtml + "<li " +  setSelectedPage(current , parseInt(pages)) + "><a href=" + url + pages + ">" + parseInt(pages) + "</a></li>";
					}
					if (current < pages) {
						outputHtml = outputHtml + "<li><a class='next-page' href='" + url + (current + 1) + "'>التالي</a></li>";
						outputHtml = outputHtml + "<li><a class='next-page' href='" + url + pages + "'> >> </a></li>";
						
					} else {
						outputHtml = outputHtml + "<li><span>التالي</span></li>";
					}
					
					element.html(outputHtml);
					
				}else { // end of huge pagination 
					if (current > 1) {
						outputHtml = "<li><a class='next-page' href='" + url + (current - 1) + "'>السابق</a></li>";
					} else {
						outputHtml = outputHtml + "<li><span>السابق</span></li>";
					}
					

					for (var i = 1; i <= pages; i++) {
						if (i === current) {
							outputHtml = outputHtml + "<li class='active'><span>" + i + "</span></li>";
						} else {
							outputHtml = outputHtml + "<li><a href=" + url + i + ">" + i + "</a></li>";
						}
					}

					if (current < pages) {
						outputHtml = outputHtml + "<li><a class='next-page' href='" + url + (current + 1) + "'>التالي</a></li>";
					} else {
						outputHtml = outputHtml + "<li><span>التالي</span></li>";
					}

					element.html(outputHtml);
				}
			}
	    }
	};
});

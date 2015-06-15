(function (global) {
    var app = global.app = global.app || {};
    
    function notification(title, message) {
        navigator.notification.alert(message, function () { }, title, "OK");
    }
    
    function showLoading(msg) {
        var msg = msg || "";
        
        kendo.mobile.application.changeLoadingMessage(msg);
        kendo.mobile.application.showLoading();
    }
    
    function hideLoading() {
        
        kendo.mobile.application.changeLoadingMessage("");
        kendo.mobile.application.hideLoading();
    }
    
    function navigateToView(view) {
        kendo.mobile.application.navigate(view);
    }
    
	function isAdmin(){
		var isAdmin = localStorage.getItem("isAdmin");
		return JSON.parse(isAdmin);
	}
    // function convertDigitIn(enDigit){
    //     var newValue="";
        
    //     for (var i=0;i<enDigit.length;i++)
    //     {
    //         var ch=enDigit.charCodeAt(i);
    //         if (ch>=48 && ch<=57)
    //         {
    //             var newChar=ch+1584;
    //             newValue=newValue+String.fromCharCode(newChar);
    //         }
    //         else
    //             newValue=newValue+String.fromCharCode(ch);
    //     }
    //     return newValue;
    // }
    
    app.common = {
        notification: notification,
        showLoading: showLoading,
        hideLoading: hideLoading,
        navigateToView: navigateToView,
		isAdmin: isAdmin
    };
})(window);
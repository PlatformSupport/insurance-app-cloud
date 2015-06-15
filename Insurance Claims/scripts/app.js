(function (global) {
	var app = global.app = global.app || {};

	app.everlive = new Everlive({
			apiKey: app.config.everlive.apiKey,
			scheme: app.config.everlive.scheme,
			authentication: {
				persist: false, // do not save an access token locally
				onAuthenticationRequired: function () {
					app.navigate('scripts/modules/login/signin.html');
				}
			}
		});
		
	
	document.addEventListener("deviceready", function () {
		navigator.splashscreen.hide();

		

		new kendo.mobile.Application(document.body, {
			platform: "ios7",
			loading: "<h1></h1>",
			initial: "scripts/modules/login/signin.html"
		});

		
		// Prevent browser native scroller
		document.ontouchmove = function () {
			return false;
		}

		kendo.onResize(function () {
			$(".ds-add-items .ds-top-container:visible").height($(".ds-add-items").height() - $(".ds-add-items .ds-detail-container").height());
			$(".ds-detail-items .ds-top-container:visible").height($(".ds-detail-items").outerHeight() - $(".ds-detail-items .ds-detail-container").height());
		});

	}, false);

})(window);
(function (global) {
    var app = global.app = global.app || {};

    app.consts = {
        status: {
            Registered: 1,
            Submitted: 2,
            Approved: 3,
            Declined: 4
        }
    };

    app.config = {
        maps :{
            apiKey  : "AIzaSyDgljyjLhGjL4F6HL__7QL9JvXk1euzIz0"
        },
		everlive: {
            apiKey: "YOUR_API_KEY",
            scheme: "https",
			insuranceClaimsTypeName: "YOUR_CONTENT_TYPE_NAME",
			adminRoleId: "ADMIN_ROLE_ID"
        },
        views: {
            init: "#init-view",
            signIn: "scripts/modules/login/signin.html",
            dashboard: "scripts/modules/dashboard/dashboard.html",
            main: "scripts/modules/dashboard/dashboard.html",
            claims: "scripts/modules/claims/claims.html",
            settings: "scripts/modules/settings/settings.html",
            settingsStarting: "scripts/modules/settings/settings-starting.html"
        }
    };
})(window);

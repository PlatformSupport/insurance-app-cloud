(function (global) {
	var LoginBase,
		SignInViewModel,
		SignUpViewModel,
		app = global.app = global.app || {};

	LoginBase = kendo.data.ObservableObject.extend({
		$view: null,

		consts: {
			PROVIDER_DEFAULT: "default",
			MESSAGE_TITLE_SIGN_IN_ERROR: "Sign In Error",
		},

		init: function () {
			var that = this;

			that.initData = $.proxy(that._initData, that);

			kendo.data.ObservableObject.fn.init.apply(that, arguments);
		},

		_initData: function () {
			var that = this;

			that.$view = $(that.viewId);
		},

		checkEnter: function (e) {
			var that = this;

			if (e.keyCode === 13) {
				$(e.target).blur();
				that.onLogin();
			}
		},

		_onStart: function (provider) {
			app.common.showLoading();
		},

		_onCancel: function (provider) {
			app.common.hideLoading();
		},

		_onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error!", e.message);
		}
	});

	SignInViewModel = LoginBase.extend({
		isLoggedIn: false,
		displayName: "",
		viewId: "#signin-view",
		username: "",
		password: "",
		consts: {
			MESSAGE_TITLE_SIGN_IN_ERROR: "Sign In Error",
			MESSAGE_EMPTY_FIELD: "Both fields are required"
		},
		onLogin: function () {
			var that = this,
				username = that.get("username").trim(),
				password = that.get("password");

			app.everlive.Users.login(username, password, $.proxy(that._onLoginSuccess, that), $.proxy(that._onError, that));
		},

		logout: function () {
			var that = this;

			that.set("isLoggedIn", false);
			app.everlive.Users.logout()
				.then($.proxy(that._onLogout, that))
				.then(null, $.proxy(that._onError, that));
		},

		_onLogout: function () {
			app.settingsService.removeCredentials();
			app.common.navigateToView(app.config.views.settingsStarting);
		},

		_onLoginSuccess: function (e) {
			var that = this;

			localStorage.setItem("isAdmin", false);
			
			app.everlive.Users.currentUser().then(function (data) {
				if (data.result) {
					var currentUserRole = data.result.Role;
					if (currentUserRole === app.config.everlive.adminRoleId) {
						localStorage.setItem("isAdmin", true);
					}
				}
				app.common.hideLoading();
				app.common.navigateToView(app.config.views.claims);
			})
		}
	});

	SignUpViewModel = LoginBase.extend({
		viewId: "#signup-view",
		username: "",
		email: "",
		password: "",
		repassword: "",
		consts: {
			MESSAGE_TITLE_SIGN_UP_ERROR: "Sign Up Error",
			MESSAGE_PASSWORD_DO_NOT_MATCH: "Passowrds do not match",
			MESSAGE_ALL_FIELDS_REQUIRED: "All fields are required"
		},

		onSignUp: function () {
			var that = this,
				username = that.get("username").trim(),
				password = that.get("password").trim(),
				repassword = that.get("repassword").trim(),
				email = that.get("email").trim();

			if (that.checkRequiredField("username") &&
				that.checkRequiredField("email") &&
				that.checkRequiredField("password") &&
				that.checkRequiredField("repassword") &&
				that.checkPassword(password, repassword)) {
				that._onStart();
				app.everlive.Users.register(username, password, {
						Email: email,
						DisplayName: username
					})
					.then($.proxy(that._onSuccess, that, that.consts.PROVIDER_DEFAULT))
					.then(null, $.proxy(that._onError, that, that.consts.PROVIDER_DEFAULT));
			}
		},

		checkRequiredField: function (field) {
			var that = this,
				fieldValue = this.get(field).trim();

			if (!fieldValue) {
				app.common.notification(that.consts.MESSAGE_TITLE_SIGN_UP_ERROR, that.consts.MESSAGE_ALL_FIELDS_REQUIRED);
				return false;
			}

			return true;
		},

		checkPassword: function (password, confirmPassword) {
			var that = this;

			if (password !== confirmPassword) {
				app.common.notification(that.consts.MESSAGE_TITLE_SIGN_UP_ERROR, that.consts.MESSAGE_PASSWORD_DO_NOT_MATCH);
				return false;
			}

			return true;
		},

		_onSuccess: function (provider, data) {
			app.common.hideLoading();
			app.common.navigateToView(app.config.views.signIn);
		},
	});

	app.loginService = {
		signInViewModel: new SignInViewModel(),
		signUpViewModel: new SignUpViewModel()
	};
})(window);
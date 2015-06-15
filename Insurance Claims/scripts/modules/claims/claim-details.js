(function (global) {
	var claimDetailsViewModel,
		claimDetailsService,
		colors = {
			2: "#F5913B",
			3: "#4AAD4D",
			4: "#E4400C"
		},
		app = global.app = global.app || {};

	claimDetailsViewModel = kendo.data.ObservableObject.extend({
		ID: "",
		Title: "",
		parentClass: "",
		Policy: "",
		innerClass: "",
		color: "",
		viewId: "#bill-details-view",
		Description: "",
		Amount: 0,
		Status: "",
		Etag: "",
		Uri: "",
		Photo: "",
		isStatusRegistered: false,
		isAdmin: false,
		Attachments: false,
		events: {
			approveClaim: "approveClaim",
			capturePhoto: "capturePhoto",
			submitForApproval: "submitForApproval",
			approve: "approve",
			decline: "decline"
		},

		init: function () {
			var that = this;
			kendo.data.ObservableObject.fn.init.apply(that, arguments);
		},

		onApproveClaimClick: function () {
			var that = this;
			that.trigger(that.events.approveClaim, {});
		},
		onAddPhotoClick: function () {
			var that = this;
			that.trigger(that.events.capturePhoto, {});
		},
		onSubmitForApprovalClick: function () {
			var that = this;
			that.trigger(that.events.submitForApproval, {});
		},
		onApproveClick: function () {
			var that = this;
			that.trigger(that.events.approve, {});
		},
		onDeclineClick: function () {
			var that = this;
			that.trigger(that.events.decline, {});
		}

	});

	claimDetailsService = kendo.Class.extend({
		viewModel: null,
		view: "",

		init: function () {
			var that = this;

			that.viewModel = new claimDetailsViewModel();

			that._bindToEvents();

			that.initModule = $.proxy(that._initModule, that);
			that.showModule = $.proxy(that._showModule, that);
		},

		_bindToEvents: function () {
			var that = this;
			that.viewModel.bind(that.viewModel.events.approveClaim, $.proxy(that.onApproveClaim, that));
			that.viewModel.bind(that.viewModel.events.capturePhoto, $.proxy(that.onCapturePhoto, that));
			that.viewModel.bind(that.viewModel.events.submitForApproval, $.proxy(that.onChangeClaimStatus, that, app.consts.status.Submitted));
			that.viewModel.bind(that.viewModel.events.approve, $.proxy(that.onChangeClaimStatus, that, app.consts.status.Approved));
			that.viewModel.bind(that.viewModel.events.decline, $.proxy(that.onChangeClaimStatus, that, app.consts.status.Declined));
		},

		_initModule: function (e) {

		},

		_showModule: function (e) {
			var that = this,
				dataId = e.view.params.dataId;

			if (!dataId) {
				return;
			}

			that.view = e.view;

			app.common.showLoading();

			that.viewModel.set("ID", dataId);

			var ds = app.claimsService.viewModel.claimsDataSource;
			var claimData = ds.getByUid(dataId);
			that.setData(claimData);

			that.viewModel.$view = $(that.viewModel.viewId);
		},

		setData: function (claimData) {
			var that = this;

			that.viewModel.set("Title", claimData.Title);
			that.viewModel.set("Description", claimData.Description);
			that.viewModel.set("Status", claimData.statusName());
			that.viewModel.set("Amount", claimData.Amount);

			if (claimData.Status == app.consts.status.Registered) {
				that.viewModel.set("isStatusRegistered", true);
				that.viewModel.set("isAdmin", false);
			} else if (claimData.Status == app.consts.status.Submitted && app.common.isAdmin()) {
				that.viewModel.set("isStatusRegistered", false);
				that.viewModel.set("isAdmin", true);
			} else {
				that.viewModel.set("isStatusRegistered", false);
				that.viewModel.set("isAdmin", false);
			}
			that.viewModel.set("Attachments", claimData.Attachments);
			that.viewModel.set("StatusColor", colors[claimData.Status]);

			if (claimData.PhotoUrl) {
				that.viewModel.set("PhotoUrl", claimData.PhotoUrl);
			}

			that.viewModel.set("Location", claimData.Address);
			app.common.hideLoading();
			$(".ds-detail-items .ds-top-container").height($(".ds-detail-items").outerHeight() - $(".ds-detail-items .ds-detail-container").height());
		},

		onChangeClaimStatus: function (status) {
			var that = this;
			app.common.showLoading("Approval proceeding. This might take a couple of minutes");

			// Update the status of the item in the data source
			var ds = app.claimsService.viewModel.claimsDataSource;
			var model = ds.getByUid(that.viewModel.get("ID"));
			model.set("Status", status);

			ds.one('sync', that.claimApproved);
			ds.sync();
		},

		// TODO
		onCapturePhoto: function () {
			app.common.notification("Not implemented", "You cannot upload an image for this claim");
		},
		_onCaptureFail: function (message) {
			app.common.notification("Error", JSON.stringify(message));
		},
		claimApproved: function (data) {
			var that = this;
			app.common.hideLoading();
			app.common.navigateToView(app.config.views.claims);
		},

		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.claimDetailsService = new claimDetailsService();
})(window);
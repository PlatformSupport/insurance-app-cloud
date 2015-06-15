(function (global) {
	var claimsViewModel,
		claimsService,
		app = global.app = global.app || {};

	claimsViewModel = kendo.data.ObservableObject.extend({
		viewId: "#claims-view",
		claimsDataSource: null,

		init: function () {
			var that = this;

			// var expandExpression = {
			// 	"Photo": {
			// 		"ReturnAs": "PhotoUrl",
			// 		"SingleField": "Uri"
			// 	}
			// };

			var filterExpression = {
				field: "Status",
				operator: "eq",
				value: app.consts.status.Registered
			};

			that.claimsDataSource = new kendo.data.DataSource({
				type: 'everlive',
				transport: {
					typeName: app.config.everlive.insuranceClaimsTypeName,
					dataProvider: app.everlive,
				},
				schema: {
					model: {
						id: Everlive.idField,
						statusName: function () {
							var statusName = '';
							switch (this.get('Status')) {
								case app.consts.status.Registered:
									statusName = 'Pending';
									break;
								case app.consts.status.Submitted:
									statusName = 'Submitted';
									break;
								case app.consts.status.Approved:
									statusName = 'Approved';
									break;
								case app.consts.status.Declined:
									statusName = 'Declined';
									break;
							}
							return statusName;
						},
					}
				},
				serverFiltering: false, // will fetch all items from the server and perform the filtering client side
				filter: filterExpression
			});
			
			that.claimsDataSource.bind("error", function(e){
				app.common.hideLoading();
				app.common.notification("Error loading claims list");
			});

			kendo.data.ObservableObject.fn.init.apply(that, that);
		},
	});


	claimsService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;
			that.viewModel = new claimsViewModel();
			that.showModule = $.proxy(that._showModule, that);
		},

		_showModule: function (e) {
			
			app.common.hideLoading();
			
			var that = this;

			that.status = e.view.params.status;

			if (that.status) {
				that.status = app.consts.status[that.status];
				var filter = {
					field: "Status",
					operator: "eq",
					value: that.status
				};
				that.viewModel.claimsDataSource.filter(filter);
			}
		}
	});

	app.claimsService = new claimsService();
})(window);
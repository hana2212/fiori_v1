sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel'
], function(Controller, ODataModel) {
	"use strict";

	return Controller.extend("fiori2.controller.test", {

		onInit: function() {
			this._oModel = new ODataModel("/sap/opu/odata/sap/ZODATA_EMPLOYEE_SRV", true);
			this.getView().setModel(this._oModel);

			this._oSmartFilterBar  = this.byId("smrtFilterBar");
		},

		toggleUpdateMode: function() {
			var oButton = this.byId("toggleUpdateMode"),
				bLiveMode = this._oSmartFilterBar.getLiveMode();

			if (bLiveMode) {
				oButton.setText("Change to 'LiveMode'");
			} else {
				oButton.setText("Change to 'ManualMode'");
			}

			this._oSmartFilterBar.setLiveMode(!bLiveMode);
		},

		onExit: function () {
			this._oModel.destroy();
			this._oModel = null;
		}
	});
});

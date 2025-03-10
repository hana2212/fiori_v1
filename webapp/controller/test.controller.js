sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/model/json/JSONModel",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/table/Table",
    "sap/ui/table/Column"
], function (Controller, ValueHelpDialog, JSONModel, ColumnListItem, Label, Text, Table, Column) {
    "use strict";

    return Controller.extend("fiori2.controller.test", {
        onInit: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("test").attachPatternMatched(this._onObjectMatched, this);
        },

        onValueHelpRequest: function (oEvent) {
            var oView = this.getView();
            var oInput = oEvent.getSource();

            if (!this._oValueHelpDialog) {
                this._oValueHelpDialog = new ValueHelpDialog({
                    title: "Select Company Code",
                    supportMultiselect: false,
                    key: "ID",
                    descriptionKey: "DEPART",
                    ok: function (oEvent) {
                        var aTokens = oEvent.getParameter("tokens");
                        oInput.setTokens(aTokens);
                        this.close();
                    },
                    cancel: function () {
                        this.close();
                    }
                });

                oView.addDependent(this._oValueHelpDialog);

                // Create a table for the ValueHelpDialog
                var oTable = new Table({
                    columns: [
                        new Column({
                            label: new Label({ text: "ID" }),
                            template: new Text({ text: "{ID}" })
                        }),
                        new Column({
                            label: new Label({ text: "Department" }),
                            template: new Text({ text: "{DEPART}" })
                        })
                    ]
                });

                this._oValueHelpDialog.setTable(oTable);
            }

            // Set the model for the ValueHelpDialog
         //   var oModel = new JSONModel();
            var oModel = this.getOwnerComponent().getModel();
            var that = this;
            oModel.read("/EmployeeSet", {
                success: function (odata) {
                    var oSearch = new JSONModel(odata.results);
                    console.log(oSearch);
                    that._oValueHelpDialog.getTable().setModel(oSearch);
                    that._oValueHelpDialog.getTable().bindRows("/");
                }, error: function () {
                    console.log("can not get data");
                }
            })

            // Open the ValueHelpDialog
            this._oValueHelpDialog.open();
        }, 

        onSearch: function() {
			var oSmartFilterBar = this.byId("smrtFilterBar"),
				oFilterResult = this.byId("filterResult"),
				oFilterProvider = oSmartFilterBar._oFilterProvider;
			/** The following code is used only for the purpose of the demo to visualize the filter query
				and since private controls are invoked it shouldn't be used in application scenarios! */
			oFilterResult.setText(decodeURIComponent(
				ODataUtils.createFilterParams(
					oSmartFilterBar.getFilters(),
					oFilterProvider._oParentODataModel.oMetadata,
					oFilterProvider._oMetadataAnalyser._getEntityDefinition(oFilterProvider.sEntityType)
				)
			));
		}
    });
});
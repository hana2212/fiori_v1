sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/model/json/JSONModel",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/table/Table",
    "sap/ui/table/Column",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, ValueHelpDialog, JSONModel, ColumnListItem, Label, Text, Table, Column, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("fiori2.controller.test", {
        onInit: function () {
            // Initialization code
        },
/*
        onPress: function (oEvent) {
            // get data 
            const oItem = oEvent.getParameter("listItem") || oEvent.getSource();
            const oContext = oItem.getBindingContext();
            const sID = oContext.getProperty("ID");
            const sDepart = oContext.getProperty("DEPART");
            const sName = oContext.getProperty("NAME");

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("test", { objectId: sID + "-" + sDepart + "-" + sName });
        },

        onValueHelpRequestFilter: function (oEvent) {
            var oView = this.getView();
            var oInput = oEvent.getSource();
            var oID = this.byId("multiInputFilter").getValue();
            console.log(oID);
            
            if (!this._oValueHelpDialog) {
                this._oValueHelpDialog = new ValueHelpDialog({
                    title: "Select Employee",
                    supportMultiselect: false,
                    key: "ID",
                    descriptionKey: "DEPART",
                    descriptionKey: "NAME",
                    ok: function (oEvent) {
                        var aTokens = oEvent.getParameter("tokens");
                        oInput.setTokens(aTokens);

                        // Create a filter based on the selected tokens
                        var aFilters = aTokens.map(function (oToken) {
                            return new Filter("ID", FilterOperator.EQ, oToken.getKey());
                        });
                        var aIDs = aFilters.map(function (oFilter) {
                            return oFilter.oValue1;
                        });
                        console.log("Selected IDs:", aIDs[1].ID);
                        
                        // Apply the filter to the SmartFilterBar
                        var oSmartFilterBar = oView.byId("smrtFilterBar");
                        oSmartFilterBar.getFilterData().ID = aFilters;
                        oSmartFilterBar.fireFilterChange();

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
                        }), 
                        new Column({
                            label: new Label({ text: "Name" }),
                            template: new Text({ text: "{NAME}" })
                        })
                    ]
                });

                this._oValueHelpDialog.setTable(oTable);
            }

            // Set the model for the ValueHelpDialog
            var oModel = this.getOwnerComponent().getModel();
            var that = this; // Store the context in a variable
            oModel.read("/EmployeeSet", {
                success: function (oData) {
                    var oSearchModel = new JSONModel(oData);
                    that._oValueHelpDialog.getTable().setModel(oSearchModel);
                    that._oValueHelpDialog.getTable().bindRows("/results");
                },
                error: function (oError) {
                    console.error("Error fetching data: ", oError);
                }
            });

            // Open the ValueHelpDialog
            this._oValueHelpDialog.open(); 
        }*/
    });
});
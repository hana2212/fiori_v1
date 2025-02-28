sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, UIComponent, Filter, FilterOperator, MessageToast) {
    "use strict";

    return Controller.extend("fiori2.controller.Detail", {
        onInit: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("Detail").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sEmployeeId = decodeURIComponent(oEvent.getParameter("arguments").ID); // get ID from URL
            var oModel = this.getOwnerComponent().getModel(); // get OData Model
            var sPath = "/EmployeeSet"; 

            // Create a filter for the ID
            var oFilter = new Filter("ID", FilterOperator.EQ, sEmployeeId);

            var that = this;
            oModel.read(sPath, {
                filters: [oFilter],
                success: function (oData) {
                    // assign data to model     
                    var oEmployeeModel = new sap.ui.model.json.JSONModel(oData.results[0]);
                    that.getView().setModel(oEmployeeModel, "Employees");  // set model to view
                
                },
                error: function (oError) {
                    MessageToast.show("Error retrieving data");
                    console.error("Error retrieving data:", oError);
                }
            });
        },

        onNavBack: function () {
        /*    var oHistory = sap.ui.core.routing.History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("HOME", {}, true);
            }*/
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("HOME");

        }
    });
});
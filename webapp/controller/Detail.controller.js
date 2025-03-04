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
            var sEmployeeId = decodeURIComponent(oEvent.getParameter("arguments").ID);
            var sPathID = "/EmployeeSet";
            var oModel = this.getOwnerComponent().getModel(); // get OData Model
            // Create a filter for the ID
            var oFilterId = new Filter("ID", FilterOperator.EQ, sEmployeeId);
            var that = this;
            // Employee details
            oModel.read(sPathID, {
                filters: [oFilterId],
                success: function (oData) {
                    // assign data to model     
                    var oEmployeeModel = new sap.ui.model.json.JSONModel(oData.results);
                    that.getView().setModel(oEmployeeModel, "Employee");

                },
                error: function (oError) {
                    MessageToast.show("Error retrieving data");
                    console.error("Error retrieving data:", oError);
                }
            });
            //Employee list
            oModel.read(sPathID, {
                success: function (oData) {
                    var oEmployeeListModel = new sap.ui.model.json.JSONModel(oData.results);
                    that.getView().setModel(oEmployeeListModel, "Employees");

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

        },

        onPressListEmployee: function (oEvent) {
            var oSelectedID = oEvent.getSource().getBindingContext("Employees").getProperty("ID")
            console.log(oSelectedID);

            var oModel = this.getOwnerComponent().getModel();
            var sPathID = "/EmployeeSet";
            var oFilterId = new Filter("ID", FilterOperator.EQ, oSelectedID);
            var that = this;
            oModel.read(sPathID, {
                filters: [oFilterId],
                success: function (oData) {
                    // assign data to model     
                    var oEmployeeModel = new sap.ui.model.json.JSONModel(oData.results);
                    that.getView().setModel(oEmployeeModel, "Employee");
                    console.log(oData.results);
                },
                error: function (oError) {
                    MessageToast.show("Error retrieving data");
                    console.error("Error retrieving data:", oError);
                }
            });
        },
        onSearch: function (oEvent) {
            var aFilter = [];
            var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
            if (sQuery) {
                aFilter.push(new Filter("NAME", FilterOperator.Contains, sQuery));
            }

            // filter binding
            var oList = this.byId("employeeListDetail");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
    });
});
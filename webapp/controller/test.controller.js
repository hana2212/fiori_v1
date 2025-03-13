sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/odata/v2/ODataModel',
    'sap/ui/comp/valuehelpdialog/ValueHelpDialog',
    'sap/ui/model/json/JSONModel',
    'sap/m/ColumnListItem',
    'sap/m/Label',
    'sap/m/Text',
    'sap/ui/table/Table',
    'sap/ui/table/Column'
], function(Controller, ODataModel, ValueHelpDialog, JSONModel, ColumnListItem, Label, Text, Table, Column) {
    "use strict";

    return Controller.extend("fiori2.controller.test", {

        onInit: function() {
            this._oModel = new ODataModel("/sap/opu/odata/sap/ZODATA_EMPLOYEE_SRV", true);
            this.getView().setModel(this._oModel);
            console.log(this._oModel);
            
            this._oSmartFilterBar  = this.byId("smrtFilterBar");
            //
            var sPathID = "/EmployeeSet";
            var oModel = this.getOwnerComponent().getModel(); 
            var that = this;
            // Employee details
            oModel.read(sPathID, {
                success: function (oData) {
                    // assign data to model     
                    console.log(oData);
                    
                    var oEmployeeModel = new sap.ui.model.json.JSONModel(oData.results);
                    that.getView().setModel(oEmployeeModel, "employeeListTest");

                },
                error: function (oError) {
                    MessageToast.show("Error retrieving data");
                    console.error("Error retrieving data:", oError);
                }
            });
        },

       
    });
});
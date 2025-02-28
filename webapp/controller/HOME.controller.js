sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (Controller) => {
  "use strict";

  return Controller.extend("fiori2.controller.HOME", {
    onInit: function () {
      // this.onReadAll();
    },
    // read data 
    onReadAll: function () {
      var that = this;
      var oModel = this.getOwnerComponent().getModel();
      oModel.read("/EmployeeSet", {
        success: function (odata) {
          console.log(odata);
          var jModel = sap.ui.model.json.JSONModel(odata);
          that.getView().byId("ID").SetModel(jModel);
        }, error: function () {
          console.log("can not get data"); ku
        }

      })
    },
    onCloseDialog: function () {
      var oDialog = this.byId("inputDialog");
      oDialog.close();
    },
    onCreate: function () {
      // open dialog
      var oDialog = this.byId("inputDialog");
      oDialog.open();
    },
    // create 
    onSubmit: function () {
      var oId = this.byId("idInput").getValue();
      var oName = this.byId("nameInput").getValue();
      var oDepart = this.byId("departInput").getValue();

      var oModel = this.getView().getModel();
      var oNewEntry = {
        // Define new entry properties, check in associations
        ID: oId,
        NAME: oName,
        DEPART: oDepart,
        TYPE: 'CREATE'
      };
      oNewEntry.DepartmentSet = []; // DepartmentSet = header 
      oModel.create("/EmployeeSet", oNewEntry, {
        success: function () {
          sap.m.MessageBox.success("Created");
        },
        error: function (oError) {
          sap.m.MessageBox.success(oError);
        }
      });
      // Close dialog 
      var oDialog = this.byId("inputDialog");
      oDialog.close();

    }
    ,
    onUpdate: function () {
      var oModel = this.getView().byId("SmartTable").getModel();
      oModel.setUseBatch(false); // not batch mode 
      var items = this.getView().byId("idTable").getSelectedItems();
      items.forEach(val => {
        var id = val.getBindingContext().getProperty("ID"); // property name in line item
        id = id.trim();
        // Update data via ID 
        var oUpdateEntry = {
          ID: '',
          TYPE: 'UPDATE'
        }
        oUpdateEntry.DepartmentSet = [];
        oModel.create("/EmployeeSet", oUpdateEntry), {
          success: function () {
            console.log("Update ok");

          },
          oError: function (oError) {
            console.log(oError);

          }
        }
      }
      )
    },
    onDelete: function (oEvent) {

      // sap.m.MessageBox.confirm("Ban co chac muon xoa khong"); 
      //if ( sap.m.MessageBox.ACTION === "OK"){
      var oModel = this.getView().byId("SmartTable").getModel();
      oModel.setUseBatch(false);
      var items = this.getView().byId("idTable").getSelectedItems();
      items.forEach(val => {
        var oId = val.getBindingContext().getProperty("ID");  // FIELD
        oId = oId.trim();
        console.log(oId);
        var oDeleteEntry = {
          ID: oId,
          TYPE: "DELETE"
        }
        oDeleteEntry.DepartmentSet = [];
        oModel.create("/EmployeeSet", oDeleteEntry, {
          success: function () {
            sap.m.MessageBox.success("Delete");
          },
          error: function (oError) {
            sap.m.MessageBox.error(oError);
          }
        })
      });
      //}
    },
    onColumnListItemPress: function (oEvent) {
      var sSelectedId = oEvent.getSource().getBindingContext().getProperty("ID");
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("Detail", { ID: sSelectedId });
    }

  });
});
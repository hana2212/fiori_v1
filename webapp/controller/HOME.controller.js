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
          console.log("can not get data");
        }

      })
    },
/*
    onCreateDialog: function () {
      var oDialog = this.byId("createDialog");
      if (!oDialog) {
        oDialog = sap.ui.xmlfragment(this.getView().getId(), "your.namespace.view.PopupFragment", this);
        this.getView().addDependent(oDialog);
      }
      oDialog.open();
    },*/
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
          ap.m.MessageBox.success(oError);
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
        var id = val.getBindingContext().getProperty("ID"); // field 
        id = id.trim();
        // Update data via ID 
        var oUpdateEntry = {
          ID: '',
          TYPE: ''
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
    /*          onDelete: function (sPath) {
                var oModel = this.getView().getModel();
                oModel.remove(sPath, {
                  success: function () {
                    MessageToast.show("delete Success");
                  },
                  error: function () {
                    MessageToast.show("can not delete");
                  }
                });
              } 
    */
    onDelete: function (oEvent) {
      var oModel = this.getView().byId("SmartTable").getModel();
      oModel.setUseBatch(false);
      var items = this.getView().byId("idTable").getSelectedItems();
      console.log(items);
      items.forEach(val => {
        var id = val.getBindingContext().getProperty("NAME");  // FIELD
        id = id.trim();
        //    id = "'" + id + "'";

        console.log(id);
        oModel.create("/EmployeeSet(" + id + ")"), {
          success: function () {
            console.log("ok");

          },
          error: function (oError) {
            console.log("oError");
          }
        };

      });

    }

  });
});
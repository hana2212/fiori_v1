sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
  "sap/ui/model/json/JSONModel",
  "sap/m/Label",
  "sap/m/Text",
  "sap/ui/table/Table",
  "sap/ui/table/Column",
  "sap/ui/core/Item",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/comp/filterbar/FilterBar",
  "sap/ui/comp/filterbar/FilterGroupItem"
], function (
  Controller, ValueHelpDialog, JSONModel, Label, Text, Table, Column, Item, Filter, FilterOperator, FilterBar, FilterGroupItem) {
  "use strict";

  return Controller.extend("fiori2.controller.HOME", {
    _oSearchModel: null,
    onInit: function () {
      //   this.onReadAll();
    },
    onAfterRendering() {
      //Set the model for the ValueHelpDialog
      this._oSearchModel = new JSONModel();
      var oModel = this.getView().getModel();
      var sPath = "/EmployeeSet";
      oModel.read(sPath, {
          success: (oData) => {
              this._oSearchModel.setData(oData.results);
          },
          error: (oError) => {
              console.error("Error fetching data: ", oError);
          }
      });
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
      var oId = this.byId("idInputHome").getValue();
      var oName = this.byId("nameInputHome").getValue();
      var oDepart = this.byId("departInputHome").getValue();

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
      var oModel = this.getView().byId("smartTable").getModel();
      oModel.setUseBatch(false); // not batch mode 
      var items = this.getView().byId("tableHome").getSelectedItems();
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
      var oModel = this.getView().byId("smartTable").getModel();
      oModel.setUseBatch(false);
      var items = this.getView().byId("tableHome").getSelectedItems();
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
    onNextPage: function () {
      console.log("next page");

      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
     // oRouter.navTo("test");
     oRouter.navTo("ValueHelpDialog");
     //oRouter.navTo("UploadSetwithTable");
 
    },

    onColumnListItemPress: function (oEvent) {
      console.log("222");
      
      var sSelectedId = oEvent.getSource().getBindingContext().getProperty("ID");
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("Detail", { ID: sSelectedId });
    },
    // onValueHelpRequestFilter: function (oEvent) {
    //   // var oView = this.getView();
    //   // var oInput = oEvent.getSource();
    //   var oView = this.getView();
    //   var oInput = oEvent.getSource();
    //   var sInputId = oInput.getId(); 
    //   var that = this;

    //   if (!this._oValueHelpDialog) {
    //     this._oValueHelpDialog = new ValueHelpDialog({
    //       title: "Select Employee List",
    //       supportMultiselect: true,
    //       key: "ID",
    //       ok: function (oEvent) {
    //         var aTokens = oEvent.getParameter("tokens");
    //         var sOperator = that._oOperatorComboBox.getSelectedKey();
    //         aTokens.forEach(token => {
    //           var sKey = token.getKey();
    //           token.setKey(sKey);
    //           token.setText(sKey);
    //           token.data("operator", sOperator); 
    //         });
    //         oInput.setTokens(aTokens);
    //         this.close();
    //       },
    //       cancel: function () {
    //         this.close();
    //       }
    //     });

    //     oView.addDependent(this._oValueHelpDialog);
    //     this._oOperatorComboBox = new sap.m.ComboBox({
    //       width: "150px",
    //       placeholder: "Select Operator",
    //       items: [
    //           new Item({ key: "EQ", text: "Equals (=)" }),
    //           new Item({ key: "Contains", text: "Contains" }),
    //           new Item({ key: "StartsWith", text: "Starts With" }),
    //           new Item({ key: "EndsWith", text: "Ends With" }),
    //           new Item({ key: "NE", text: "Not Equal (≠)" }),
    //           new Item({ key: "GT", text: "Greater Than (>)" }),
    //           new Item({ key: "LT", text: "Less Than (<)" })
    //       ],
    //       selectedKey: "EQ"
    //   });
      

      
    //   var oFilterBar = new FilterBar({
    //     advancedMode: true,
    //     filterBarExpanded: true,
    //     filterGroupItems: [
    //         new FilterGroupItem({
    //             groupName: "default",
    //             name: "operator",
    //             label: "Operator",
    //             control: this._oOperatorComboBox
    //         })
    //     ]
    // });

  
    // this._oValueHelpDialog.setFilterBar(oFilterBar);
    //     // Create a table for the ValueHelpDialog
    //     var oTable = new Table({
    //       columns: [
    //         new Column({
    //           label: new Label({ text: "ID" }),
    //           template: new Text({ text: "{ID}" })
    //         }),
    //         new Column({
    //           label: new Label({ text: "Depart" }),
    //           template: new Text({ text: "{DEPART}" })
    //         }),
    //         new Column({
    //           label: new Label({ text: "Name" }),
    //           template: new Text({ text: "{NAME}" })
    //         })
    //       ]
    //     });

    //     this._oValueHelpDialog.setTable(oTable);
    //   }


    //   // Set the model for the ValueHelpDialog
    //   var oModel = this.getView().getModel();
    //   var sPath = "/EmployeeSet";
    //   // var oFilter = new sap.ui.model.Filter("ID", FilterOperator.Contains, oInput.getValue());
    //   var oFilter = new sap.ui.model.Filter("ID", FilterOperator.EQ, "222");

    //   oModel.read(sPath, {
    //     //  filters: [oFilter],
    //     success: (oData) => {
    
          
    //       var oSearchModel = new JSONModel(oData.results);
    //       this._oValueHelpDialog.getTable().setModel(oSearchModel);
    //       this._oValueHelpDialog.getTable().bindRows("/");
    //     },
    //     error: (oError) => {
    //       console.error("Error fetching data: ", oError);
    //     }
    //   });
    //   // Open the ValueHelpDialog
    //   this._oValueHelpDialog.open();
    // },
    // onBeforeRebindTable: function (oEvent) {
    //   var oBindingParams = oEvent.getParameter("bindingParams");
    //   var oDocNoFilter = this.byId("multiInputFilter");

    //   if (oDocNoFilter) {
    //     var aDocNoTokens = oDocNoFilter.getTokens();

    //     if (aDocNoTokens && aDocNoTokens.length > 0) {
    //       aDocNoTokens.forEach(function (oToken) {
    //         var sValue = oToken.getKey();
    //         oBindingParams.filters.push(new Filter("ID", FilterOperator.EQ, sValue));
    //       });
    //     }
    //   }

    //   console.log("Filters:", oBindingParams.filters);
    // },

    // // download and upload file 
    // onUpload: function () {

    // },
    // onDownloadTemplate: function () {

    // }

    onValueHelpRequestFilter: function (oEvent) {
      var oView = this.getView();
      var oInput = oEvent.getSource();
      var sInputId = oInput.getId(); 
      var that = this;
  
      if (!this._oValueHelpDialog) {
          this._oValueHelpDialog = new ValueHelpDialog({
              title: "Select Value",
              supportMultiselect: true,
              key: "ID",
              descriptionKey: "NAME",
              ok: function (oEvent) {
                  var aTokens = oEvent.getParameter("tokens");
                  var sOperator = that._oOperatorComboBox.getSelectedKey();
                  
                  aTokens.forEach(token => {
                      var sKey = token.getKey(); 
                      token.setKey(sKey);
                      token.setText(sKey);
                      token.data("operator", sOperator); 
                  });
  
                  oInput.setTokens(aTokens);
                  this.close();
              },
              cancel: function () {
                  this.close();
              }
          });
  
          oView.addDependent(this._oValueHelpDialog);
  
          this._oOperatorComboBox = new sap.m.ComboBox({
              width: "150px",
              placeholder: "Select Operator",
              items: [
                  new Item({ key: "EQ", text: "Equals (=)" }),
                  new Item({ key: "Contains", text: "Contains" }),
                  new Item({ key: "StartsWith", text: "Starts With" }),
                  new Item({ key: "EndsWith", text: "Ends With" }),
                  new Item({ key: "NE", text: "Not Equal (≠)" }),
                  new Item({ key: "GT", text: "Greater Than (>)" }),
                  new Item({ key: "LT", text: "Less Than (<)" })
              ],
              selectedKey: "EQ"
          });
  
          var oFilterBar = new FilterBar({
              advancedMode: true,
              filterBarExpanded: true,
              filterGroupItems: [
                  new FilterGroupItem({
                      groupName: "default",
                      name: "operator",
                      label: "Operator",
                      control: this._oOperatorComboBox
                  })
              ]
          });
          
          this._oValueHelpDialog.setFilterBar(oFilterBar);
  
          // Create a table for the ValueHelpDialog
          var oTable = new Table({
              columns: [
                  new Column({
                      label: new Label({ text: "ID" }),
                      template: new Text({ text: "{ID}" })
                  }),
                  new Column({
                      label: new Label({ text: "Name" }),
                      template: new Text({ text: "{NAME}" })
                  }),
                  new Column({
                      label: new Label({ text: "Depart" }),
                      template: new Text({ text: "{DEPART}" })
                  }),
             
              ]
          });
  
          this._oValueHelpDialog.setTable(oTable);
      }
      
      // if (sInputId.indexOf("CompanyCodeFilter") !== -1) {
      //     this._oValueHelpDialog.setTitle("Select Company Code");
      // } else if (sInputId.indexOf("Doc.NoFilter") !== -1) {
      //     this._oValueHelpDialog.setTitle("Select Document Number");
      // }
      
      //Set data for search help
      this._oValueHelpDialog.getTable().setModel(this._oSearchModel);
      this._oValueHelpDialog.getTable().bindRows("/");
      
      // Open the ValueHelpDialog
      this._oValueHelpDialog.open();
  },
  
  onBeforeRebindTable: function(oEvent) {
      var oBindingParams = oEvent.getParameter("bindingParams");
      var oDocNoFilter = this.byId("multiInputFilter");
    //  var oCompanyCodeFilter = this.byId("CompanyCodeFilter");
      
      if (oDocNoFilter) {
          var aDocNoTokens = oDocNoFilter.getTokens();
          
          if (aDocNoTokens && aDocNoTokens.length > 0) {
              aDocNoTokens.forEach(function(oToken) {
                  var sValue = oToken.getKey();
                  var sOperator = oToken.data("operator") || "EQ"; 
                  var oFilterOp = this._getFilterOperator(sOperator);
                  
                  oBindingParams.filters.push(new Filter("", oFilterOp, sValue));
              }.bind(this));
          }
      }
      
     
      
      console.log("Filters:", oBindingParams.filters);
  },
  
  _getFilterOperator: function(sOperator) {
      switch(sOperator) {
          case "EQ":
              return FilterOperator.EQ;
          case "NE":
              return FilterOperator.NE;
          case "GT":
              return FilterOperator.GT;
          case "GE":
              return FilterOperator.GE;
          case "LT":
              return FilterOperator.LT;
          case "LE":
              return FilterOperator.LE;
          case "Contains":
              return FilterOperator.Contains;
          case "StartsWith":
              return FilterOperator.StartsWith;
          case "EndsWith":
              return FilterOperator.EndsWith;
          default:
              return FilterOperator.EQ;
      }
  }
  });
});
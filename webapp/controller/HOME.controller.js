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
        // add Name filter 
        this._oNameInput = new sap.m.MultiInput({
          showValueHelp: true,
          valueHelpRequest: function (oEvent) {
            var that = this;
            if (!this._oNameValueHelpDialog) {
              // Replace the _oNameValueHelpDialog configuration
              // Replace the _oNameValueHelpDialog configuration inside valueHelpRequest
              this._oNameValueHelpDialog = new ValueHelpDialog({
                title: "Name Filter",
                supportRanges: true,
                supportRangesOnly: true,
                key: "NAME",
                descriptionKey: "NAME",
                ok: function (oEvent) {
                  try {
                    var aTokens = [];
                    var oDialog = oEvent.getSource();

                    // Get conditions from _oSelectedRanges
                    var oSelectedRanges = oDialog._oSelectedRanges;
                    console.log("Selected ranges:", oSelectedRanges);

                    // Loop through conditions (condition_0, condition_1, etc.)
                    for (var key in oSelectedRanges) {
                      if (key.startsWith('condition_')) {
                        var oCondition = oSelectedRanges[key];
                        console.log("Processing condition:", oCondition);

                        if (!oCondition.exclude) {  // Only include non-excluded conditions
                          var sText;
                          switch (oCondition.operation) {
                            case "BT":
                              sText = oCondition.value1 + "..." + oCondition.value2;
                              break;
                            case "Contains":
                              sText = "Contains " + oCondition.value1;
                              break;
                            case "StartsWith":
                              sText = "Starts with " + oCondition.value1;
                              break;
                            case "EndsWith":
                              sText = "Ends with " + oCondition.value1;
                              break;
                            case "EQ":
                              sText = "= " + oCondition.value1;
                              break;
                            case "GT":
                              sText = "> " + oCondition.value1;
                              break;
                            case "LT":
                              sText = "< " + oCondition.value1;
                              break;
                            default:
                              sText = oCondition.operation + " " + oCondition.value1;
                          }

                          aTokens.push(new sap.m.Token({
                            key: JSON.stringify({
                              operation: oCondition.operation,
                              value1: oCondition.value1,
                              value2: oCondition.value2,
                              keyField: oCondition.keyField
                            }),
                            text: sText
                          }));
                        }
                      }
                    }

                    // Set tokens to the MultiInput
                    that._oNameInput.setTokens(aTokens);
                    console.log("Setting tokens:", aTokens);

                    oDialog.close();
                  } catch (error) {
                    console.error("Error in ok handler:", error);
                    oDialog.close();
                  }
                },
                cancel: function (oEvent) {
                  oEvent.getSource().close();
                }
              });

              // Set range key fields
              this._oNameValueHelpDialog.setRangeKeyFields([{
                label: "Name",
                key: "NAME",
                type: "string",
                typeInstance: new sap.ui.model.type.String(),
                operations: ["Contains", "EQ", "StartsWith", "EndsWith", "BT", "GT", "LT"]
              }]);

              // Add dialog to view
              this.getView().addDependent(this._oNameValueHelpDialog);

              // Set filter bar for name dialog
              var oFilterBar = new FilterBar({
                advancedMode: true,
                filterGroupItems: [
                  new FilterGroupItem({
                    groupName: "Properties",
                    name: "name",
                    label: "Name",
                    control: new sap.m.Input()
                  })
                ]
              });

              this._oNameValueHelpDialog.setFilterBar(oFilterBar);

              // Set range key fields for Define Conditions tab
              this._oNameValueHelpDialog.setRangeKeyFields([{
                label: "Name",
                key: "NAME",
                type: "string",
                typeInstance: new sap.ui.model.type.String(),
                operations: ["Contains", "EQ", "StartsWith", "EndsWith", "BT", "GT", "LT"]
              }]);

              this.getView().addDependent(this._oNameValueHelpDialog);
            }

            this._oNameValueHelpDialog.open();
          }.bind(this)
        });
        // end add 
        var oFilterBar = new FilterBar({
          advancedMode: true,
          filterBarExpanded: true,
          filterGroupItems: [
            new FilterGroupItem({
              groupName: "default",
              name: "operator",
              label: "Operator",
              control: this._oOperatorComboBox
            }),
            new FilterGroupItem({
              groupName: "default",
              name: "name",
              label: "Name",
              control: this._oNameInput
            })
          ]
        });

        this._oValueHelpDialog.setFilterBar(oFilterBar);

        // Create a table for the ValueHelpDialog
        var oTable = new Table({
          selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly,
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

      //Set data for search help
      this._oValueHelpDialog.getTable().setModel(this._oSearchModel);
      this._oValueHelpDialog.getTable().bindRows("/");
      // start change 

      var oFilterBar = this._oValueHelpDialog.getFilterBar();
      if (oFilterBar) {
        oFilterBar.detachSearch(this._onFilterBarSearch, this);
        oFilterBar.attachSearch(this._onFilterBarSearch, this);
      }

      //end add 
      this._oValueHelpDialog.open();
    },
    // apply filter Name to the dialog
    _onFilterBarSearch: function() {
      try {
          var oTable = this._oValueHelpDialog.getTable();
          var oBinding = oTable.getBinding("rows");
          var aFilters = [];
  
          // Get input from Name filter
          var oNameInput = this._oNameInput;
          if (oNameInput) {
              var sInputValue = oNameInput.getValue();
              
              // Handle direct input
              if (sInputValue && sInputValue.trim() !== "") {
                  // Create new condition object
                  var oCondition = {
                      operation: "EQ",
                      value1: sInputValue,
                      value2: null,
                      keyField: "NAME"
                  };
  
                  // Create token with proper JSON string
                  var oToken = new sap.m.Token({
                      key: JSON.stringify(oCondition),
                      text: "=" + sInputValue
                  });
  
                  // Set single token and clear input
                  oNameInput.setTokens([oToken]);
                  oNameInput.setValue("");
  
                  // Create and add filter
                  aFilters.push(new Filter("NAME", FilterOperator.EQ, sInputValue));
              } else {
                  // Process existing tokens if any
                  var aTokens = oNameInput.getTokens();
                  if (aTokens && aTokens.length > 0) {
                      aTokens.forEach(function(oToken) {
                          if (oToken && oToken.getKey()) {
                              try {
                                  var oCondition = JSON.parse(oToken.getKey());
                                  if (oCondition && oCondition.operation && oCondition.value1) {
                                      var oFilter = null;
                                      
                                      switch (oCondition.operation) {
                                          case "Contains":
                                              oFilter = new Filter("NAME", FilterOperator.Contains, oCondition.value1);
                                              break;
                                          case "StartsWith":
                                              oFilter = new Filter("NAME", FilterOperator.StartsWith, oCondition.value1);
                                              break;
                                          case "EndsWith":
                                              oFilter = new Filter("NAME", FilterOperator.EndsWith, oCondition.value1);
                                              break;
                                          case "EQ":
                                              oFilter = new Filter("NAME", FilterOperator.EQ, oCondition.value1);
                                              break;
                                          case "BT":
                                              if (oCondition.value2) {
                                                  oFilter = new Filter("NAME", FilterOperator.BT, oCondition.value1, oCondition.value2);
                                              }
                                              break;
                                          case "GT":
                                              oFilter = new Filter("NAME", FilterOperator.GT, oCondition.value1);
                                              break;
                                          case "LT":
                                              oFilter = new Filter("NAME", FilterOperator.LT, oCondition.value1);
                                              break;
                                          default:
                                              oFilter = new Filter("NAME", FilterOperator.EQ, oCondition.value1);
                                      }
  
                                      if (oFilter) {
                                          aFilters.push(oFilter);
                                      }
                                  }
                              } catch (e) {
                                  console.error("Error processing token:", e);
                              }
                          }
                      });
                  }
              }
  
              // Apply filters
              if (aFilters.length > 0) {
                  oBinding.filter(new Filter({
                      filters: aFilters,
                      and: false
                  }));
              } else {
                  oBinding.filter([]);
              }
  
              // Update dialog
              this._oValueHelpDialog.update();
          }
      } catch (error) {
          console.error("Error in filter bar search:", error);
      }
  },
    // end add 
    _getFilterOperator: function (sOperator) {
      switch (sOperator) {
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
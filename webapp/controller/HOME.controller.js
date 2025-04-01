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
          supportMultiselect: false,
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
          // showValueHelp: true,
          valueHelpRequest: function (oEvent) {
            var that = this;
            if (!this._oNameValueHelpDialog) {
              this._oNameValueHelpDialog = new ValueHelpDialog({
                title: "Name Filter",
                supportRanges: true,  // tab define condition
                supportRangesOnly: true, // tab select and ... 
                key: "NAME",
                descriptionKey: "NAME",
                // Replace the ok function in _oNameValueHelpDialog configuration
                ok: function (oEvent) {
                  try {
                    var aTokens = [];
                    var oDialog = oEvent.getSource();
                    var oSelectedRanges = oDialog._oSelectedRanges;

                    for (var key in oSelectedRanges) {
                      if (key.startsWith('condition_')) {
                        var oCondition = oSelectedRanges[key];
                        if (!oCondition.exclude) {
                          var sText;
                          switch (oCondition.operation) {
                            case "BT":
                              sText = `${oCondition.value1}...${oCondition.value2}`;
                              aTokens.push(new sap.m.Token({
                                key: JSON.stringify(oCondition),
                                text: sText,
                                tooltip: `Between ${oCondition.value1} and ${oCondition.value2}`
                              }));
                              break;
                            case "Contains":
                              sText = `*${oCondition.value1}*`;
                              aTokens.push(new sap.m.Token({
                                key: JSON.stringify(oCondition),
                                text: sText,
                                tooltip: `Contains ${oCondition.value1}`
                              }));
                              break;
                            case "StartsWith":
                              sText = `${oCondition.value1}*`;
                              aTokens.push(new sap.m.Token({
                                key: JSON.stringify(oCondition),
                                text: sText,
                                tooltip: `Starts with ${oCondition.value1}`
                              }));
                              break;
                            case "EndsWith":
                              sText = `*${oCondition.value1}`;
                              aTokens.push(new sap.m.Token({
                                key: JSON.stringify(oCondition),
                                text: sText,
                                tooltip: `Ends with ${oCondition.value1}`
                              }));
                              break;
                            case "EQ":
                              sText = `=${oCondition.value1}`;
                              aTokens.push(new sap.m.Token({
                                key: JSON.stringify(oCondition),
                                text: sText,
                                tooltip: `Equal to ${oCondition.value1}`
                              }));
                              break;
                            case "GT":
                              sText = `>${oCondition.value1}`;
                              aTokens.push(new sap.m.Token({
                                key: JSON.stringify(oCondition),
                                text: sText,
                                tooltip: `Greater than ${oCondition.value1}`
                              }));
                              break;
                            case "LT":
                              sText = `<${oCondition.value1}`;
                              aTokens.push(new sap.m.Token({
                                key: JSON.stringify(oCondition),
                                text: sText,
                                tooltip: `Less than ${oCondition.value1}`
                              }));
                              break;
                            default:
                              sText = `${oCondition.operation} ${oCondition.value1}`;
                              aTokens.push(new sap.m.Token({
                                key: JSON.stringify(oCondition),
                                text: sText,
                                tooltip: `${oCondition.operation} ${oCondition.value1}`
                              }));
                          }
                        }
                      }
                    }

                    that._oNameInput.setTokens(aTokens);
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
      // update filter 
      var oFilterBar = this._oValueHelpDialog.getFilterBar();
      if (oFilterBar) {
        oFilterBar.detachSearch(this._onFilterBarSearch, this);
        oFilterBar.attachSearch(this._onFilterBarSearch, this);
      }
      // end update filter
      this._oValueHelpDialog.open();
    },
    // apply filter Name to the dialog
    _onFilterBarSearch: function () {
      try {
        var oTable = this._oValueHelpDialog.getTable();
        var oBinding = oTable.getBinding("rows");
        var aFilters = [];
        var that = this;

        // Get input from Name filter
        var oNameInput = this._oNameInput;
        if (oNameInput) {
          var sInputValue = oNameInput.getValue();
          var aTokens = oNameInput.getTokens();

          // Handle direct input - convert to equals token
          if (sInputValue && sInputValue.trim() !== "") {
            var oNewToken = new sap.m.Token({
              text: "=" + sInputValue,
              tooltip: "Equal to " + sInputValue
            });
            oNameInput.setTokens([oNewToken]);
            oNameInput.setValue(""); // Clear input
            aTokens = [oNewToken]; // Update tokens array with new token
          }

          // Process tokens if they exist
          if (aTokens && aTokens.length > 0) {
            aTokens.forEach(function (oToken) {
              try {
                // Get tooltip value which contains operation and value
                var sTooltip = oToken.getTooltip();
                var oFilter;

                if (sTooltip) {
                  if (sTooltip.startsWith("Contains")) {
                    var value = sTooltip.substring("Contains ".length);
                    oFilter = new Filter("NAME", FilterOperator.Contains, value);
                  } else if (sTooltip.startsWith("Equal to")) {
                    var value = sTooltip.substring("Equal to ".length);
                    oFilter = new Filter("NAME", FilterOperator.EQ, value);
                  } else if (sTooltip.startsWith("Starts with")) {
                    var value = sTooltip.substring("Starts with ".length);
                    oFilter = new Filter("NAME", FilterOperator.StartsWith, value);
                  } else if (sTooltip.startsWith("Ends with")) {
                    var value = sTooltip.substring("Ends with ".length);
                    oFilter = new Filter("NAME", FilterOperator.EndsWith, value);
                  } else if (sTooltip.startsWith("Greater than")) {
                    var value = sTooltip.substring("Greater than ".length);
                    oFilter = new Filter("NAME", FilterOperator.GT, value);
                  } else if (sTooltip.startsWith("Less than")) {
                    var value = sTooltip.substring("Less than ".length);
                    oFilter = new Filter("NAME", FilterOperator.LT, value);
                  }

                  if (oFilter) {
                    aFilters.push(oFilter);
                  }
                }
              } catch (e) {
                console.error("Error processing token:", e);
              }
            });
          }

          // Apply combined filters
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
    },
    onValueHelpRequestFilterName: function (oEvent) {
      var oView = this.getView();
      var oInput = oEvent.getSource();
      var that = this;

      if (!this._oValueHelpDialog) {
        this._oValueHelpDialog = new ValueHelpDialog({
          title: "Name Filter",
          supportMultiselect: true,
          supportRanges: true,
          key: "NAME",
          descriptionKey: "DEPART",
          ok: function (oEvent) {
            try {
              var aTokens = [];
              var oDialog = oEvent.getSource();
              var oSelectedRanges = oDialog._oSelectedRanges;

              // Handle Define Conditions tab tokens
              for (var key in oSelectedRanges) {
                if (key.startsWith('condition_')) {
                  var oCondition = oSelectedRanges[key];
                  if (!oCondition.exclude) {
                    var sText;
                    switch (oCondition.operation) {
                      case "BT":
                        sText = `${oCondition.value1}...${oCondition.value2}`;
                        aTokens.push(new sap.m.Token({
                          key: JSON.stringify(oCondition),
                          text: sText,
                          tooltip: `Between ${oCondition.value1} and ${oCondition.value2}`
                        }));
                        break;
                      case "Contains":
                        sText = `*${oCondition.value1}*`;
                        aTokens.push(new sap.m.Token({
                          key: JSON.stringify(oCondition),
                          text: sText,
                          tooltip: `Contains ${oCondition.value1}`
                        }));
                        break;
                      case "StartsWith":
                        sText = `${oCondition.value1}*`;
                        aTokens.push(new sap.m.Token({
                          key: JSON.stringify(oCondition),
                          text: sText,
                          tooltip: `Starts with ${oCondition.value1}`
                        }));
                        break;
                      case "EndsWith":
                        sText = `*${oCondition.value1}`;
                        aTokens.push(new sap.m.Token({
                          key: JSON.stringify(oCondition),
                          text: sText,
                          tooltip: `Ends with ${oCondition.value1}`
                        }));
                        break;
                      case "EQ":
                        sText = `=${oCondition.value1}`;
                        aTokens.push(new sap.m.Token({
                          key: JSON.stringify(oCondition),
                          text: sText,
                          tooltip: `Equal to ${oCondition.value1}`
                        }));
                        break;
                      case "GT":
                        sText = `>${oCondition.value1}`;
                        aTokens.push(new sap.m.Token({
                          key: JSON.stringify(oCondition),
                          text: sText,
                          tooltip: `Greater than ${oCondition.value1}`
                        }));
                        break;
                      case "LT":
                        sText = `<${oCondition.value1}`;
                        aTokens.push(new sap.m.Token({
                          key: JSON.stringify(oCondition),
                          text: sText,
                          tooltip: `Less than ${oCondition.value1}`
                        }));
                        break;
                    }
                  }
                }
              }

              // Set tokens to input
              oInput.setTokens(aTokens);

              // Trigger SmartFilter refresh
              var oSmartFilterBar = that.getView().byId("smartFilterBar");
              if (oSmartFilterBar) {
                oSmartFilterBar.fireSearch();
              }

              this.close();
            } catch (error) {
              console.error("Error in ok handler:", error);
              this.close();
            }
          },
          cancel: function () {
            this.close();
          }
        });

        // Create filter bar for Search tab
        var oFilterBar = new FilterBar({
          advancedMode: true,
          search: function (oEvent) {
            var sSearchQuery = oFilterBar.getFilterGroupItems()[0].getControl().getValue();
            var oTable = that._oValueHelpDialog.getTable();
            var oBinding = oTable.getBinding("rows");

            if (sSearchQuery) {
              var oFilter = new Filter({
                filters: [
                  new Filter("NAME", FilterOperator.Contains, sSearchQuery),
                  new Filter("DEPART", FilterOperator.Contains, sSearchQuery)
                ],
                and: true
              });
              oBinding.filter(oFilter);
            } else {
              oBinding.filter([]);
            }
          },
          filterGroupItems: [
            new FilterGroupItem({
              groupName: "Search",
              name: "searchField",
              label: "Search",
              control: new sap.m.SearchField({
                width: "100%",
                placeholder: "Search"
              })
            })
          ]
        });

        this._oValueHelpDialog.setFilterBar(oFilterBar);

        // Create table for Search tab
        var oTable = new Table({
          //selectionMode: "Multi",
          columns: [
            new Column({
              label: new Label({ text: "Name" }),
              template: new Text({ text: "{NAME}" })
            }),
            new Column({
              label: new Label({ text: "Department" }),
              template: new Text({ text: "{DEPART}" }),
              visible: true
            })
          ],
          selectionChange: function (oEvent) {
            var aSelectedItems = oTable.getSelectedIndices();
            var aTokens = [];

            aSelectedItems.forEach(function (iIndex) {
              var oContext = oTable.getContextByIndex(iIndex);
              var oData = oContext.getObject();
              aTokens.push(new sap.m.Token({
                key: oData.NAME,
                text: oData.NAME,
                tooltip: `Equal to ${oData.NAME}`
              }));
            });

            that._oValueHelpDialog.setTokens(aTokens);
          }
        });

        this._oValueHelpDialog.setTable(oTable);

        // Set range key fields for Define Conditions tab
        this._oValueHelpDialog.setRangeKeyFields([{
          label: "Name",
          key: "NAME",
          type: "string",
          typeInstance: new sap.ui.model.type.String(),
          operations: ["Contains", "EQ", "StartsWith", "EndsWith", "BT", "GT", "LT"]
        }]);

        oView.addDependent(this._oValueHelpDialog);
      }

      // Set model and bind rows
      this._oValueHelpDialog.getTable().setModel(this._oSearchModel);
      this._oValueHelpDialog.getTable().bindRows("/");

      this._oValueHelpDialog.open();
    },
    onNameFilterChange: function (oEvent) {
      var sValue = oEvent.getParameter("value");
      if (sValue) {
        var oInput = oEvent.getSource();
        var oToken = new sap.m.Token({
          key: sValue,
          text: "=" + sValue,
          tooltip: `Equal to ${sValue}`
        });
        oInput.setValue(""); // Clear input
        oInput.setTokens([oToken]);
      }
    },

    onNameFilterSubmit: function (oEvent) {
      var oSmartFilterBar = this.getView().byId("smartFilterBar");
      if (oSmartFilterBar) {
        oSmartFilterBar.fireSearch();
      }
    },
    // Update filter for SmartTable
    onBeforeRebindTable: function (oEvent) {
      var oBindingParams = oEvent.getParameter("bindingParams");
      var aFilters = [];

      // Handle ID filter
      var oDocNoFilter = this.byId("multiInputFilter");
      if (oDocNoFilter) {
        var aDocNoTokens = oDocNoFilter.getTokens();
        if (aDocNoTokens && aDocNoTokens.length > 0) {
          var aIdFilters = [];
          aDocNoTokens.forEach(function (oToken) {
            var sValue = oToken.getKey();
            var sOperator = oToken.getData("operator") || "EQ";
            var oFilterOp = this._getFilterOperator(sOperator);
            aIdFilters.push(new Filter("ID", oFilterOp, sValue));
          }.bind(this));

          if (aIdFilters.length > 0) {
            aFilters.push(new Filter({
              filters: aIdFilters,
              and: false
            }));
          }
        }
      }

      // Handle NAME filter
      var oNameFilter = this.byId("multiInputFilterName");
      if (oNameFilter) {
        var aNameTokens = oNameFilter.getTokens();
        console.log("Processing tokens:", aNameTokens); // Debug log

        if (aNameTokens && aNameTokens.length > 0) {
          var aNameFilters = [];

          aNameTokens.forEach(function (oToken) {
            try {
              var sTooltip = oToken.getTooltip();
              console.log("Token tooltip:", sTooltip); // Debug log

              if (sTooltip) {
                if (sTooltip.startsWith("Contains")) {
                  var value = sTooltip.substring("Contains ".length);
                  aNameFilters.push(new Filter("NAME", FilterOperator.Contains, value));
                } else if (sTooltip.startsWith("Equal to")) {
                  var value = sTooltip.substring("Equal to ".length);
                  aNameFilters.push(new Filter("NAME", FilterOperator.EQ, value));
                } else if (sTooltip.startsWith("Starts with")) {
                  var value = sTooltip.substring("Starts with ".length);
                  aNameFilters.push(new Filter("NAME", FilterOperator.StartsWith, value));
                } else if (sTooltip.startsWith("Ends with")) {
                  var value = sTooltip.substring("Ends with ".length);
                  aNameFilters.push(new Filter("NAME", FilterOperator.EndsWith, value));
                } else if (sTooltip.startsWith("Between")) {
                  var parts = sTooltip.substring("Between ".length).split(" and ");
                  if (parts.length === 2) {
                    aNameFilters.push(new Filter("NAME", FilterOperator.BT, parts[0], parts[1]));
                  }
                } else if (sTooltip.startsWith("Greater than")) {
                  var value = sTooltip.substring("Greater than ".length);
                  aNameFilters.push(new Filter("NAME", FilterOperator.GT, value));
                } else if (sTooltip.startsWith("Less than")) {
                  var value = sTooltip.substring("Less than ".length);
                  aNameFilters.push(new Filter("NAME", FilterOperator.LT, value));
                }
              }

              console.log("Created filter:", aNameFilters[aNameFilters.length - 1]); // Debug log

            } catch (error) {
              console.error("Error processing token:", error);
            }
          });

          if (aNameFilters.length > 0) {
            aFilters.push(new Filter({
              filters: aNameFilters,
              and: false
            }));
          }
        }
      }

      // Apply all filters
      if (aFilters.length > 0) {
        oBindingParams.filters = oBindingParams.filters || [];
        oBindingParams.filters.push(new Filter({
          filters: aFilters,
          and: true
        }));
      }

    }




  });
});
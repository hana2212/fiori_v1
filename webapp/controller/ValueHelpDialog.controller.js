sap.ui.define([
	'sap/ui/comp/library',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/table/Column',
	'sap/m/Column',
	'sap/m/Text', 
	"sap/ui/model/json/JSONModel",
], function (compLibrary,Controller, TypeString, ColumnListItem, Label, SearchField, Token, Filter, FilterOperator, ODataModel, UIColumn, MColumn, Text, JSONModel) {
	"use strict";

	return Controller.extend("fiori2.controller.ValueHelpDialog", {
		onInit: function () {
			var oMultiInput, oMultiInputWithSuggestions;
			// Value Help Dialog standard use case with filter bar without filter suggestions
			oMultiInput = this.byId("multiInput");
			oMultiInput.addValidator(this._onMultiInputValidate);
			//oMultiInput.setTokens(this._getDefaultTokens());
			this._oMultiInput = oMultiInput;

		
		},
		onExit: function() {
			if (this.oProductsModel) {
				this.oProductsModel.destroy();
				this.oProductsModel = null;
			}
		},
		// #region Value Help Dialog standard use case with filter bar without filter suggestions
		onValueHelpRequested: function() {
			this._oBasicSearchField = new SearchField();
			this.loadFragment({
				name: "fiori2.view.ValueHelpDialogFilterbar"
			}).then(function(oDialog) {
				var oFilterBar = oDialog.getFilterBar(), oColumnID, oColumnName;
				this._oVHD = oDialog;

				this.getView().addDependent(oDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oDialog.setRangeKeyFields([{
					label: "ID",
					key: "ID",
					type: "string",
					typeInstance: new TypeString({}, {
						maxLength: 7
					})
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				// Trigger filter bar search when the basic search is fired
				this._oBasicSearchField.attachSearch(function() {
					oFilterBar.search();
				});

				// oDialog.getTableAsync().then(function (oTable) {

				// 	oTable.setModel(this.oProductsModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
				// 	if (oTable.bindRows) {
				// 		// Bind rows to the ODataModel and add columns
				// 		oTable.bindAggregation("rows", {
				// 			path: "/EmployeeSet",
				// 			events: {
				// 				dataReceived: function() {
				// 					oDialog.update();
				// 				}
				// 			}
				// 		});
				// 		oColumnID = new UIColumn({label: new Label({text: "ID"}), template: new Text({wrapping: false, text: "{ProductCode}"})});
				// 		oColumnID.data({
				// 			fieldName: "ID"
				// 		});
				// 		oColumnName = new UIColumn({label: new Label({text: "Name"}), template: new Text({wrapping: false, text: "{ProductName}"})});
				// 		oColumnName.data({
				// 			fieldName: "NAME"
				// 		});
				// 		oTable.addColumn(oColumnID);
				// 		oTable.addColumn(oColumnName);
				// 	}

				// 	// For Mobile the default table is sap.m.Table
				// 	if (oTable.bindItems) {
				// 		// Bind items to the ODataModel and add columns
				// 		oTable.bindAggregation("items", {
				// 			path: "/EmployeeSet",
				// 			template: new ColumnListItem({
				// 				cells: [new Label({text: "{ID}"}), new Label({text: "{NAME}"})]
				// 			}),
				// 			events: {
				// 				dataReceived: function() {
				// 					oDialog.update();
				// 				}
				// 			}
				// 		});
				// 		oTable.addColumn(new MColumn({header: new Label({text: "ID"})}));
				// 		oTable.addColumn(new MColumn({header: new Label({text: "Name"})}));
				// 	}
				// 	oDialog.update();
				// }.bind(this));
				var sPath = "/EmployeeSet";
				var oModel = this.getView().getModel();
				
				oModel.read(sPath, {
					success: (oData) => {
						var oSearchModel = new JSONModel(oData.results);
						oDialog.getTableAsync().then(function (oTable) {
							oTable.setModel(oSearchModel);
							
							if (oTable.bindRows) {
								oTable.bindRows("/");
								oColumnID = new UIColumn({label: new Label({text: "ID"}), template: new Text({wrapping: false, text: "{ID}"})});
								oColumnID.data({ fieldName: "ID" });
								oColumnName = new UIColumn({label: new Label({text: "Name"}), template: new Text({wrapping: false, text: "{NAME}"})});
								oColumnName.data({ fieldName: "NAME" });
								oTable.addColumn(oColumnID);
								oTable.addColumn(oColumnName);
							}
		
							if (oTable.bindItems) {
								oTable.bindAggregation("items", {
									path: "/",
									template: new ColumnListItem({
										cells: [new Label({text: "{ID}"}), new Label({text: "{NAME}"})]
									})
								});
								oTable.addColumn(new MColumn({header: new Label({text: "ID"})}));
								oTable.addColumn(new MColumn({header: new Label({text: "Name"})}));
							}
							
							oDialog.update();
						});
					},
					error: (oError) => {
						console.error("Error fetching data: ", oError);
					}
				});




				oDialog.setTokens(this._oMultiInput.getTokens());
				oDialog.open();
			}.bind(this));
		},

		onValueHelpOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInput.setTokens(aTokens);
			this._oVHD.close();
		},

		onValueHelpCancelPress: function () {
			this._oVHD.close();
		},

		onValueHelpAfterClose: function () {
			this._oVHD.destroy();
		},
		// #endregion
		// Internal helper methods
		// _getDefaultTokens: function () {
		// 	var ValueHelpRangeOperation = compLibrary.valuehelpdialog.ValueHelpRangeOperation;
		// 	var oToken1 = new Token({
		// 		key: "",
		// 		text: ""
		// 	});

		// 	var oToken2 = new Token({
		// 		key: "range_0",
		// 		text: ""
		// 	}).data("range", {
		// 		"exclude": true,
		// 		"operation": ValueHelpRangeOperation.EQ,
		// 		"keyField": "ID",
		// 		"value1": "PD-102",
		// 		"value2": ""
		// 	});

		// 	return [oToken1, oToken2];
		// },
		_onMultiInputValidate: function(oArgs) {
			var sWhitespace = " ",
				sUnicodeWhitespaceCharacter = "\u00A0"; // Non-breaking whitespace

			if (oArgs.suggestionObject) {
				var oObject = oArgs.suggestionObject.getBindingContext().getObject(),
					oToken = new Token(),
					sOriginalText = oObject.ProductCode.replaceAll((sWhitespace + sWhitespace), (sWhitespace + sUnicodeWhitespaceCharacter));

				oToken.setKey(oObject.ProductCode);
				oToken.setText(oObject.ProductName + " (" + sOriginalText + ")");
				return oToken;
			}
			return null;
		},
		_filterTable: function (oFilter) {
			var oVHD = this._oVHD;

			oVHD.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}
				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}

				// This method must be called after binding update of the table.
				oVHD.update();
			});
		}
	});
});

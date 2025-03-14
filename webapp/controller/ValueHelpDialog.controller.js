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
	'sap/m/Text'
], function (compLibrary, Controller, TypeString, ColumnListItem, Label, SearchField, Token, Filter, FilterOperator, ODataModel, UIColumn, MColumn, Text) {
	"use strict";

	return Controller.extend("fiori2.controller.ValueHelpDialog", {
		onInit: function () {
			var oMultiInput, oMultiInputWithSuggestions;
			// Value Help Dialog standard use case with filter bar without filter suggestions
			oMultiInput = this.byId("multiInput");
			oMultiInput.addValidator(this._onMultiInputValidate);
			oMultiInput.setTokens(this._getDefaultTokens());
			this._oMultiInput = oMultiInput;

			// Value Help Dialog filters with suggestions
			oMultiInputWithSuggestions = this.byId("multiInputWithSuggestions");
			oMultiInputWithSuggestions.addValidator(this._onMultiInputValidate);
			oMultiInputWithSuggestions.setTokens(this._getDefaultTokens());
			this._oMultiInputWithSuggestions = oMultiInputWithSuggestions;

			// Whitespace
			this._oWhiteSpacesInput = this.byId("whiteSpaces");
			this._oWhiteSpacesInput.addValidator(this._onMultiInputValidate);

			this.oProductsModel = new ODataModel("/MockDataService", true);
			this.getView().setModel(this.oProductsModel);
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
				name: "fiori2.controller.ValueHelpDialogFilterbar"
			}).then(function(oDialog) {
				var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
				this._oVHD = oDialog;

				this.getView().addDependent(oDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oDialog.setRangeKeyFields([{
					label: "Product",
					key: "ProductCode",
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

				oDialog.getTableAsync().then(function (oTable) {

					oTable.setModel(this.oProductsModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						// Bind rows to the ODataModel and add columns
						oTable.bindAggregation("rows", {
							path: "/ZSALESREPORT",
							events: {
								dataReceived: function() {
									oDialog.update();
								}
							}
						});
						oColumnProductCode = new UIColumn({label: new Label({text: "Product Code"}), template: new Text({wrapping: false, text: "{ProductCode}"})});
						oColumnProductCode.data({
							fieldName: "ProductCode"
						});
						oColumnProductName = new UIColumn({label: new Label({text: "Product Name"}), template: new Text({wrapping: false, text: "{ProductName}"})});
						oColumnProductName.data({
							fieldName: "ProductName"
						});
						oTable.addColumn(oColumnProductCode);
						oTable.addColumn(oColumnProductName);
					}

					// For Mobile the default table is sap.m.Table
					if (oTable.bindItems) {
						// Bind items to the ODataModel and add columns
						oTable.bindAggregation("items", {
							path: "/ZSALESREPORT",
							template: new ColumnListItem({
								cells: [new Label({text: "{ProductCode}"}), new Label({text: "{ProductName}"})]
							}),
							events: {
								dataReceived: function() {
									oDialog.update();
								}
							}
						});
						oTable.addColumn(new MColumn({header: new Label({text: "Product Code"})}));
						oTable.addColumn(new MColumn({header: new Label({text: "Product Name"})}));
					}
					oDialog.update();
				}.bind(this));

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

		// #region Value Help Dialog filters with suggestions
		onValueHelpWithSuggestionsRequested: function() {
			this._oBasicSearchFieldWithSuggestions = new SearchField();

			this.pDialogWithSuggestions = this.loadFragment({
				name: "fiori2.controller.ValueHelpDialogFilterbarWithSuggestions"
			}).then(function(oDialogSuggestions) {
				var oFilterBar = oDialogSuggestions.getFilterBar(), oColumnProductCode, oColumnProductName;
				this._oVHDWithSuggestions = oDialogSuggestions;

				this.getView().addDependent(oDialogSuggestions);

				// Set key fields for filtering in the Define Conditions Tab
				oDialogSuggestions.setRangeKeyFields([{
					label: "Product Code",
					key: "ProductCode",
					type: "string",
					typeInstance: new TypeString({}, {
						maxLength: 7
					})
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchFieldWithSuggestions);

				// Trigger filter bar search when the basic search is fired
				this._oBasicSearchFieldWithSuggestions.attachSearch(function() {
					oFilterBar.search();
				});

				oDialogSuggestions.getTableAsync().then(function (oTable) {

					oTable.setModel(this.oProductsModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						// Bind rows to the ODataModel and add columns
						oTable.bindAggregation("rows", {
							path: "/ZSALESREPORTSuggestions",
							events: {
								dataReceived: function() {
									oDialogSuggestions.update();
								}
							}
						});
						oColumnProductCode = new UIColumn({label: new Label({text: "Product Code"}), template: new Text({wrapping: false, text: "{ProductCode}"})});
						oColumnProductCode.data({
							fieldName: "ProductCode"
						});
						oTable.addColumn(oColumnProductCode);

						oColumnProductName = new UIColumn({label: new Label({text: "Product Name"}), template: new Text({wrapping: false, text: "{ProductName}"})});
						oColumnProductName.data({
							fieldName: "ProductName"
						});
						oTable.addColumn(oColumnProductName);
					}

					// For Mobile the default table is sap.m.Table
					if (oTable.bindItems) {
						// Bind items to the ODataModel and add columns
						oTable.bindAggregation("items", {
							path: "/ZSALESREPORTSuggestions",
							template: new ColumnListItem({
								cells: [new Label({text: "{ProductCode}"}), new Label({text: "{ProductName}"})]
							}),
							events: {
								dataReceived: function() {
									oDialogSuggestions.update();
								}
							}
						});
						oTable.addColumn(new MColumn({header: new Label({text: "Product Code"})}));
						oTable.addColumn(new MColumn({header: new Label({text: "Product Name"})}));
					}
					oDialogSuggestions.update();
				}.bind(this));

				oDialogSuggestions.setTokens(this._oMultiInputWithSuggestions.getTokens());
				oDialogSuggestions.open();
			}.bind(this));
		},
		onValueHelpWithSuggestionsOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInputWithSuggestions.setTokens(aTokens);
			this._oVHDWithSuggestions.close();
		},
		onValueHelpWithSuggestionsCancelPress: function () {
			this._oVHDWithSuggestions.close();
		},
		onFilterBarWithSuggestionsSearch: function (oEvent) {
			var sSearchQuery = this._oBasicSearchFieldWithSuggestions.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet"),
				aFilters = aSelectionSet && aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);

			aFilters.push(new Filter({
				filters: [
					new Filter({ path: "ProductCode", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "ProductName", operator: FilterOperator.Contains, value1: sSearchQuery })
				],
				and: false
			}));

			this._filterTableWithSuggestions(new Filter({
				filters: aFilters,
				and: true
			}));
		},
		_filterTableWithSuggestions: function (oFilter) {
			var oVHD = this._oVHDWithSuggestions;
			oVHD.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}
				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}
				oVHD.update();
			});
		},
		onValueHelpWithSuggestionsAfterClose: function () {
			this._oVHDWithSuggestions.destroy();
		},
		// #endregion

		// #region Whitespace

		// #region Whitespace value help
		onWhitespaceVHRequested: function() {
			var oTextTemplate = new Text({text: {path: 'ProductCode'}, renderWhitespace: true});
			this._oBasicSearchField = new SearchField({
				search: function() {
					this.oWhitespaceDialog.getFilterBar().search();
				}.bind(this)
			});

			this.pWhitespaceDialog = this.loadFragment({
				name: "fiori2.controller.ValueHelpDialogWhitespaces"
			}).then(function(oWhitespaceDialog) {
				var oFilterBar = oWhitespaceDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
				this.oWhitespaceDialog = oWhitespaceDialog;

				this.getView().addDependent(oWhitespaceDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oWhitespaceDialog.setRangeKeyFields([{
					label: "Product Code",
					key: "ProductCode",
					type: "string",
					typeInstance: new TypeString({}, {
						maxLength: 7
					})
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				// Re-map whitespaces
				oFilterBar.determineFilterItemByName("ProductCode").getControl().setTextFormatter(this._inputTextFormatter);

				oWhitespaceDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(this.oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oColumnProductCode = new UIColumn({label: new Label({text: "Product Code"}), template: oTextTemplate});
						oColumnProductCode.data({
							fieldName: "ProductCode"
						});
						oTable.addColumn(oColumnProductCode);

						oColumnProductName = new UIColumn({label: new Label({text: "Product Name"}), template: new Text({wrapping: false, text: "{ProductName}"})});
						oColumnProductName.data({
							fieldName: "ProductName"
						});
						oTable.addColumn(oColumnProductName);
						oTable.bindAggregation("rows", {
							path: "/ZSALESREPORTWhitespace",
							events: {
								dataReceived: function() {
									oWhitespaceDialog.update();
								}
							}
						});
					}

					// For Mobile the default table is sap.m.Table
					if (oTable.bindItems) {
						oTable.addColumn(new MColumn({header: new Label({text: "Product Code"})}));
						oTable.addColumn(new MColumn({header: new Label({text: "Product Name"})}));
						oTable.bindItems({
							path: "/ZSALESREPORTWhitespace",
							template: new ColumnListItem({
								cells: [new Label({text: "{ProductCode}"}), new Label({text: "{ProductName}"})]
							}),
							events: {
								dataReceived: function() {
									oWhitespaceDialog.update();
								}
							}
						});
					}

					oWhitespaceDialog.update();
				}.bind(this));

				oWhitespaceDialog.setTokens(this._oWhiteSpacesInput.getTokens());
				oWhitespaceDialog.open();
			}.bind(this));
		},
		_inputTextFormatter: function (oItem) {
			var sOriginalText = oItem.getText(),
				sWhitespace = " ",
				sUnicodeWhitespaceCharacter = "\u00A0"; // Non-breaking whitespace

			if (typeof sOriginalText !== "string") {
				return sOriginalText;
			}

			return sOriginalText
				.replaceAll((sWhitespace + sUnicodeWhitespaceCharacter), (sWhitespace + sWhitespace));
		},
		whitespace2Char: function (sOriginalText) {
			var sWhitespace = " ",
				sUnicodeWhitespaceCharacter = "\u00A0"; // Non-breaking whitespace

			if (typeof sOriginalText !== "string") {
				return sOriginalText;
			}

			return sOriginalText
				.replaceAll((sWhitespace + sWhitespace), (sWhitespace + sUnicodeWhitespaceCharacter)); // replace spaces
		},
		// #endregion
		onFilterBarSearch: function (oEvent) {
			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");

			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);

			aFilters.push(new Filter({
				filters: [
					new Filter({ path: "ProductCode", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "ProductName", operator: FilterOperator.Contains, value1: sSearchQuery })
				],
				and: false
			}));

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
		},
		onFilterBarWhitespacesSearch: function (oEvent) {
			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");

			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);

			aFilters.push(new Filter({
				filters: [
					new Filter({ path: "ProductCode", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "ProductName", operator: FilterOperator.Contains, value1: sSearchQuery })
				],
				and: false
			}));

			this._filterTableWhitespace(new Filter({
				filters: aFilters,
				and: true
			}));
		},

		_filterTableWhitespace: function (oFilter) {
			var oValueHelpDialog = this.oWhitespaceDialog;
			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}
				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}
				oValueHelpDialog.update();
			});
		},
		onWhitespaceOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			aTokens.forEach(function (oToken) {
				oToken.setText(this.whitespace2Char(oToken.getText()));
			}.bind(this));
			this._oWhiteSpacesInput.setTokens(aTokens);
			this.oWhitespaceDialog.close();
		},
		onWhitespaceCancelPress: function () {
			this.oWhitespaceDialog.close();
		},
		onWhitespaceAfterClose: function () {
			this.oWhitespaceDialog.destroy();
		},
		// @endregion
		// Internal helper methods
		_getDefaultTokens: function () {
			var ValueHelpRangeOperation = compLibrary.valuehelpdialog.ValueHelpRangeOperation;
			var oToken1 = new Token({
				key: "PD-103",
				text: "Mouse (PD-103)"
			});

			var oToken2 = new Token({
				key: "range_0",
				text: "!(=PD-102)"
			}).data("range", {
				"exclude": true,
				"operation": ValueHelpRangeOperation.EQ,
				"keyField": "ProductCode",
				"value1": "PD-102",
				"value2": ""
			});

			return [oToken1, oToken2];
		},
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

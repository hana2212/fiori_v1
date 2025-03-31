// filepath: e:\fiori_v1\webapp\controller\App.controller.js
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment"
], function (Controller, Fragment) {
  "use strict";

  return Controller.extend("fiori2.controller.App", {
      onInit: function () {
          // Initialization code
      },

      // onOpenValueHelpDialog: function () {
      //     var oView = this.getView();

      //     if (!this._pValueHelpDialog) {
      //         this._pValueHelpDialog = Fragment.load({
      //             id: oView.getId(),
      //             name: "fiori2.controller.ValueHelpDialogFilterbar",
      //             controller: this
      //         }).then(function (oDialog) {
      //             oView.addDependent(oDialog);
      //             return oDialog;
      //         });
      //     }
      //     this._pValueHelpDialog.then(function (oDialog) {
      //         oDialog.open();
      //     });
      // },

      // onCloseValueHelpDialog: function () {
      //     this.byId("valueHelpDialog").close();
      // }
  });
});
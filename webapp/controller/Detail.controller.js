sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], (Controller) => {
    "use strict";
  
    return Controller.extend("fiori2.controller.Detail", {     
        onInit: function () {
            console.log("2222");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Detail").attachMatched(this._onRouteMatched, this);
         
            
        },
        _onRouteMatched: function (oEvent) {
            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();
            oView.bindElement({
                path: "/Employees(" + oArgs.Id + ")",
                events: {
                    dataRequested: function () {
                        oView.setBusy(true);
                    },
                    dataReceived: function () {
                        oView.setBusy(false);
                    }
                }
            });
        },
        handleNavButtonPress: function (evt) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("HOME");
        }, 
        onPress : function(){
            oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      //     oRouter.navTo("Detail"); 
           oRouter.navTo("Detail", { employeeId: sEmployeeId });
        }, 
        onNavBack: function () {           
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
                
            if (sPreviousHash !== undefined) {
                window.history.go(-1)
            } else {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("HOME", {}, true)
            }
        },
    });

});
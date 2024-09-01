sap.ui.define(
  ["sap/m/MessageToast", "sap/ui/core/mvc/View"],
  function (MessageToast, View) {
    "use strict";

    return {
      fileUpload: function () {
        var oView = this.editFlow.getView();
        var oDialog = oView.byId("dialog");
        if (!oDialog) {
          View.create({
            viewName: "railway.view.Dialog",
            type: sap.ui.core.mvc.ViewType.XML,
          }).then(function (oDialogView) {
            oView.addDependent(oDialogView);
            oDialog = oDialogView.byId("dialog");
            if (oDialog) {
              oDialog.open();
            } else {
              console.error("Dialog not found in the view!");
            }
          });
        } else {
          oDialog.open();
        }
      },
    };
  }
);

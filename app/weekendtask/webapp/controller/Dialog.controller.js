sap.ui.define(
  ["sap/ui/core/mvc/Controller", "weekendtask/libs/styleXLSX"],
  function (Controller) {
    "use strict";
    return Controller.extend("weekendtask.controller.Dialog", {
      onSubmit: function () {
        var upFile = this.byId("fileUploader");
        var upFileInput = document.getElementById(upFile.getId() + "-fu");
        var file = upFileInput.files[0];
        var oController = this;

        if (file) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var sData = e.target.result;
            var oWorkbook = XLSX.read(sData, { type: "binary" });
            var oWorksheet = oWorkbook.Sheets[oWorkbook.SheetNames[0]];
            var aJsonData = XLSX.utils.sheet_to_json(oWorksheet, { header: 1 });
            var aFormattedData = aJsonData.slice(1).map(function (aRow) {
              return {
                name: aRow[0] || "",
                exg: aRow[1] || "",
                price: aRow[2] || "",
              };
            });
            var jsonString = JSON.stringify(aFormattedData);
            $.ajax({
              url: "/odata/v4/Stocks/uploadData",
              method: "POST",
              contentType: "application/json",
              data: JSON.stringify({ jsonData: jsonString }),
              success: function (response) {
                sap.m.MessageToast.show("Data imported successfully");
                console.log(response);
                var oDialog = oController.byId("dialog");
                if (oDialog) {
                  oDialog.close();
                }
                window.location.reload();
              },
              error: function (error) {
                console.error("Error importing data: ", error);
                sap.m.MessageToast.show("Error importing data.");
              },
            });
          };

          reader.readAsBinaryString(file);
        }
      },
      onCancel: function () {
        var oDialog = this.byId("dialog");
        if (oDialog) {
          oDialog.close();
        }
      },
      onFileChange: function (oEvent) {
        var upFile = oEvent.getSource();
        var oSubmitButton = this.byId("submitButton");
        if (upFile.getValue()) {
          oSubmitButton.setEnabled(true);
        } else {
          oSubmitButton.setEnabled(false);
        }
      },
      onDownload: function () {
        var wb = XLSX.utils.book_new();
        var wsData = [["Name", "Exchange", "Price"]];
        var ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
        function s2ab(s) {
          var oBuffer = new ArrayBuffer(s.length);
          var view = new Uint8Array(oBuffer);
          for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
          return oBuffer;
        }
        var blob = new Blob([s2ab(wbout)], {
          type: "application/octet-stream",
        });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "stocks-template.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
    });
  }
);

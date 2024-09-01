sap.ui.define(
  ["sap/ui/core/mvc/Controller", "weekendtask/libs/styleXLSX"],
  function (Controller) {
    "use strict";
    return Controller.extend("weekendtask.controller.Dialog", {
      onSubmitDialogPress: function () {
        var oFileUploader = this.byId("fileUploader");
        var oFileUploaderInput = document.getElementById(
          oFileUploader.getId() + "-fu"
        );
        var file = oFileUploaderInput.files[0];
        var that = this;

        if (file) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: "binary" });
            var worksheet = workbook.Sheets[workbook.SheetNames[0]];
            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            var formattedData = jsonData.slice(1).map(function (row) {
              return {
                name: row[0] || "",
                exg: row[1] || "",
                price: row[2] || "",
              };
            });
            var jsonString = JSON.stringify(formattedData);
            $.ajax({
              url: "/odata/v4/Stocks/uploadData",
              method: "POST",
              contentType: "application/json",
              data: JSON.stringify({ jsonData: jsonString }),
              success: function (response) {
                sap.m.MessageToast.show("Data imported successfully!");
                console.log(response);
                var oDialog = that.byId("dialog");
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
      onCancelDialogPress: function () {
        var oDialog = this.byId("dialog");
        if (oDialog) {
          oDialog.close();
        }
      },
      onFileChange: function (oEvent) {
        var oFileUploader = oEvent.getSource();
        var oSubmitButton = this.byId("submitButton");
        if (oFileUploader.getValue()) {
          oSubmitButton.setEnabled(true);
        } else {
          oSubmitButton.setEnabled(false);
        }
      },
      onDownloadTemplatePress: function () {
        var wb = XLSX.utils.book_new();
        var wsData = [["Name", "Exchange", "Price"]];
        var ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
        function s2ab(s) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
          return buf;
        }
        var blob = new Blob([s2ab(wbout)], {
          type: "application/octet-stream",
        });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "railway_template.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
    });
  }
);

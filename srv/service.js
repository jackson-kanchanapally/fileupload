const cds = require("@sap/cds");

module.exports = cds.service.impl(async function () {
  const { Stock } = this.entities;

  this.on("uploadStockData", async (req) => {
    const jsonData = JSON.parse(req.data.jsonData);

    const tx = cds.transaction(req);

    const insertPromises = jsonData.map((data) => {
      return tx.run(
        INSERT.into(Stock).entries({
          name: data.name || "",
          exg: data.exg || "",
          price: data.price || "",
        })
      );
    });

    await Promise.all(insertPromises);

    return { message: "Data imported successfully!" };
  });
});

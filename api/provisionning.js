const { downloadCandidates } = require("./services/ProvisionningService.js");

(async () => {
  console.log("Starting candidates scrapping.");
  try{
    if (await downloadCandidates()) {
      console.log("Successfully finished candidates scrapping.");
    } else {
      console.log("Failed candidates scrapping.");
    }
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();

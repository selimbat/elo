const db = require("./db");
const { initCandidates } = require("./services/ProvisionningService.js");

(async () => {
  const isTestContext = false;
  const overwrite = false;
  console.log("Starting db provisionning.");
  try{
    if (await db.connect()) {
      if (await initCandidates(overwrite, !isTestContext)) {
        console.log("Successfully finished db provisionning.");
      } else {
        console.log("Failed db provisionning.");
      }
    }
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();

const Candidate = require("./resources/Candidate");
const Encounter = require("./resources/Encounter");
const scrapper = require('./services/CandidatesScrapperService');
const db = require("./db");

initCandidates = async (overwrite, submit) => {
  try {
    if (overwrite){
      await Candidate.deleteMany();
      await Encounter.deleteMany();
    }
    const doc = await Candidate.findOne({});
    if(overwrite || !doc){
      const candidate = new Candidate();
      await candidate.initCandidates(scrapper, submit);
      return true;
    } else {
      console.log("Found at least a document in the collection.")
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

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

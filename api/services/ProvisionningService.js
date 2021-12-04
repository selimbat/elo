const Candidate = require("../resources/Candidate");
const Encounter = require("../resources/Encounter");
const EncounterTracker = require("../resources/EncounterTracker");
const scrapper = require('./CandidatesScrapperService');

exports.initCandidates = async (overwrite, submit) => {
  try {
    if (overwrite){
      exports.teardown();
    }
    const doc = await Candidate.findOne({});
    if(overwrite || !doc){
      await Candidate.initCandidates(scrapper, submit);
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

exports.teardown = async () => {
  await Candidate.deleteMany();
  await Encounter.deleteMany();
  await EncounterTracker.deleteMany();
};

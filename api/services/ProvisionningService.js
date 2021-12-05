const Candidate = require("../resources/Candidate");
const Encounter = require("../resources/Encounter");
const EncounterTracker = require("../resources/EncounterTracker");
const scrapper = require('./CandidatesScrapperService');
const EloService = require('./EloService.js');

exports.initCandidates = async (overwrite, submit, isTestContext = false) => {
  try {
    if (overwrite){
      exports.teardown();
    }
    const doc = await Candidate.findOne({});
    if(overwrite || !doc){
      await Candidate.initCandidates(scrapper, submit, isTestContext);
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

exports.populateRandomEncounters = async (nbEncounters) => {
  try {
    let candidates = await Candidate.find();
    if (candidates.length < 2) {
      return;
    }
    for (let i = 0; i < nbEncounters; i++){
      let candidate1 = candidates[Math.floor(Math.random() * candidates.length)];
      let candidate2;
      do {
        candidate2 = candidates[Math.floor(Math.random() * candidates.length)];
      } while (candidate1._id == candidate2._id);
      let leftProbability = EloService.GetProbablity(candidate1, candidate2);
      const encounter = new Encounter({
        candidate1Id: candidate1._id,
        candidate2Id: candidate2._id,
        outcome: Math.random() < leftProbability ? 1 : -1,
        originIPAddress: "somewhere"
      });
      await encounter.save();
      let encounterResult = EloService.ComputeResults(candidate1, candidate2, encounter.outcome);
      await EloService.SubmitEncounterResult(encounterResult);
    }
  } catch (error) {
    console.log(error);
  }
}

exports.teardown = async () => {
  await Candidate.deleteMany();
  await Encounter.deleteMany();
  await EncounterTracker.deleteMany();
};

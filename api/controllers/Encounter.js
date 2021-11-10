const Encounter = require("../resources/Encounter");
const EncounterTracker = require("../controllers/EncounterTracker");
const EloService = require("../services/EloService");

exports.registerOne = async (req, res, next) => {
  try {
    delete req.body._id;
    if ((!req.body.hasOwnProperty("candidate1Id") || !req.body.hasOwnProperty("candidate2Id"))
        || req.body.candidate1Id == req.body.candidate2Id) {
      res.status(400).json({ message: "An encounter has to specify two different candidates." });
      return;
    }
    const encounter = new Encounter({
      ...req.body
    });
    await encounter.save();
    let encounterResult = await EloService.ComputeEncounterResults(encounter);
    await EloService.SubmitEncounterResult(encounterResult);
    let encounterTracker = await EncounterTracker.tryGet(encounter.candidate1Id, encounter.candidate2Id);
    if (encounterTracker == null) {
      encounterTracker = await EncounterTracker.createOne(encounter.candidate1Id, encounter.candidate2Id);
    }
    encounterTracker.increment(encounter);
    res.status(200).json({
      message: `Encounter between candidates of id ${encounterResult.items[0].candidateId} and ${encounterResult.items[1].candidateId} succeffully registered. The winner gained ${Math.abs(encounterResult.items[0].scoreDiff)}`
    });
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};
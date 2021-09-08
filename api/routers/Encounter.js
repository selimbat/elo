const express = require("express");
const router = express.Router();

const Encounter = require('../resources/Encounter');
const EloService = require('../services/EloService');

router.post('/', async (req, res, next) => {
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
    res.status(200).json({
      message: `Encounter between candidates of id ${encounterResult.items[0].candidateId} and ${encounterResult.items[1].candidateId} succeffully registered. The winner gained ${Math.abs(encounterResult.items[0].scoreDiff)}`
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
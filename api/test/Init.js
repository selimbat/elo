const { initCandidates, populateRandomEncounters } = require('../services/ProvisionningService.js');
const db = require('../db.js');

module.exports = async () => {
  try{
    if (await db.connect(true)) {
      await initCandidates(true, true, true);
      await populateRandomEncounters(50);
    }
  } catch (err) {
    console.log(err);
  }
}
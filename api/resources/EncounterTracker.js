const mongoose = require('mongoose');
const Encounter = require("../resources/Encounter");

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  candidate1Id: { type: String, ref: "Candidate", required: true },
  candidate2Id: { type: String, ref: "Candidate", required: true },
  nb1IsMoreLeftThan2: {
    type: Number,
    required: true,
  },
  nbSimilar: {
    type: Number,
    required: true,
  },
  nb1IsMoreRightThan2: {
    type: Number,
    required: true,
  },
});

schema.methods = {
  /**
   * @param {Encounter} encounter 
   */
  increment(encounter){
    let inverted;
    if (encounter.candidate1Id == this.candidate1Id && encounter.candidate2Id == this.candidate2Id) {
      inverted = false;
    } else if (encounter.candidate1Id == this.candidate2Id && encounter.candidate2Id == this.candidate1Id) {
      inverted = true;
    } else {
      throw Error("Trying to increment a tracker with the wrong encounter.");
    }
    let outcome = encounter.outcome;
    if (inverted) {
      outcome = -outcome;
    }
    const outcomes = Encounter.getOutcomeEnum();
    this.nb1IsMoreLeftThan2 += outcome == outcomes.MORE_LEFT ? 1 : 0;
    this.nbSimilar += outcome == outcomes.SIMILAR ? 1 : 0;
    this.nb1IsMoreRightThan2 += outcome == outcomes.MORE_RIGHT ? 1 : 0;
    this.save().catch(console.log);
  }
};

module.exports = mongoose.model('EncounterTracker', schema);
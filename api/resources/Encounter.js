const mongoose = require('mongoose');

const Outcome = {
  MORE_LEFT: 1,
  SIMILAR: 0,
  MORE_RIGHT: -1
}

const encounterSchema = mongoose.Schema({
  candidate1Id: { type: mongoose.ObjectId, ref="Candidate", required: true },
  candidate2Id: { type: mongoose.ObjectId, ref="Candidate", required: true },
  outcome: { type: Number, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  originIPAddress: { type: String, required: true}
});

encounterSchema.statics.checkOutcomeValidity = function(outcome) {
  // 1 if candidate1 is judged more left-leaning than candidate2
  // 0 if candidate1 is judged similar to candidate2
  // -1 if candidate1 is judged more right-leaning than candidate2
  if (outcome !== Outcome.MORE_LEFT && outcome !== Outcome.SIMILAR && outcome !== Outcome.MORE_RIGHT) {
    throw new Error(`Unsupported outcome value (${outcome}) for Encounter.`);
  }
}

module.exports = mongoose.model('Encounter', encounterSchema);
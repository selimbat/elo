const mongoose = require('mongoose');

const encounterSchema = mongoose.Schema({
  candidate1Id: { type: Number, required: true },
  candidate2Id: { type: Number, required: true },
  outcome: { type: Number, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  originIPAddress: { type: String, required: true}
});

encounterSchema.statics.checkOutcomeValidity = function(outcome) {
  // 1 if candidate1 is judged more left-leaning than candidate2
  // 0 if candidate1 is judged similar to candidate2
  // -1 if candidate1 is judged more right-leaning than candidate2
  if (outcome !== 1 && outcome !== 0 && outcome !== -1){
    throw new Error(`Unsupported outcome value (${outcome}) for Encounter.`);
  }
}

module.exports = mongoose.model('Encounter', encounterSchema);
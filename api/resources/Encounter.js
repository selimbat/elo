const mongoose = require('mongoose');

// 1 if candidate1 is judged more left-leaning than candidate2
// 0 if candidate1 is judged similar to candidate2
// -1 if candidate1 is judged more right-leaning than candidate2
const Outcome = {
  MORE_LEFT: 1,
  SIMILAR: 0,
  MORE_RIGHT: -1
}

/**
 * @param {Number} outcome 
 * @returns true if outcome valid, false otherwise
 */
const checkOutcomeValidity = (outcome) => {
  return Object.values(Outcome).indexOf(outcome) >= 0;
}

const encounterSchema = mongoose.Schema({
  candidate1Id: { type: mongoose.ObjectId, ref:"Candidate", required: true },
  candidate2Id: { type: mongoose.ObjectId, ref:"Candidate", required: true },
  outcome: { 
    type: Number,
    required: true,
    validate: {
      validator: checkOutcomeValidity,
      message: "The given value for 'outcome' isn't valid."
    }
  },
  timestamp: { type: Date, required: true, default: Date.now },
  originIPAddress: { type: String, required: true}
});

module.exports = mongoose.model('Encounter', encounterSchema);
const mongoose = require('mongoose');
const Encounter = require("../resources/Encounter");

const trackerSchema = mongoose.Schema({
  _id: { type: String, required: true },
  candidate1Id: { type: mongoose.ObjectId, ref: "Candidate", required: true },
  candidate2Id: { type: mongoose.ObjectId, ref: "Candidate", required: true },
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

trackerSchema.methods = {
  /**
   * @param {Encounter} encounter 
   */
  increment(encounter){
    let inverted;
    if (encounter.candidate1Id.equals(this.candidate1Id) && encounter.candidate2Id.equals(this.candidate2Id)){
      inverted = false;
    } else if (encounter.candidate1Id.equals(this.candidate2Id) && encounter.candidate2Id.equals(this.candidate1Id)) {
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

trackerSchema.statics = {
  /**
   * @param {ObjectId} candidate1Id 
   * @param {ObjectId} candidate2Id 
   * @returns A query object used to get the tracker for the two given candidates.
   */
  buildQuery(candidate1Id, candidate2Id) {
    return {
      _id: {
        $in: [
          `${candidate1Id.toString()}:${candidate2Id.toString()}`,
          `${candidate2Id.toString()}:${candidate1Id.toString()}`
        ]
      }
    };
  },

  /**
   * @param {ObjectId} candidate1Id 
   * @param {ObjectId} candidate2Id
   * @returns True if the tracker for the two candidates exists in db, false otherwise.
   */
   async checkIfExists(candidate1Id, candidate2Id) {
    try {
      const model = mongoose.model('EncounterTracker');
      return await model.exists(model.buildQuery(candidate1Id, candidate2Id));
    } catch (error) {
      console.log("Failed to check if a tracker exists: " + error.message);
      return false;
    }
  },

  /**
   * @param {ObjectId} candidate1Id 
   * @param {ObjectId} candidate2Id
   * @returns The tracker for the two candidates if it exists in db, null otherwise.
   */
   async tryGet(candidate1Id, candidate2Id) {
    try {
      const model = mongoose.model('EncounterTracker');
      return await model.findOne(model.buildQuery(candidate1Id, candidate2Id));
    } catch (error) {
      console.log("Failed to get a tracker: " + error.message);
      return null;
    }
  },

  /**
   * @param {ObjectId} candidate1Id 
   * @param {ObjectId} candidate2Id 
   * @returns The created encounter tracker or null if the creation failed.
   */
  async createOne(candidate1Id, candidate2Id) {
    try {
      if (candidate1Id.equals(candidate2Id)){
        console.log("Two different candidates are required to create an encounter tracker.");
        return null;
      }
      const model = mongoose.model('EncounterTracker');
      if (await model.checkIfExists(candidate1Id, candidate2Id)) {
        console.log("The tracker for the two given candidates already exists");
        return null;
      }
      return await new model({
        _id: `${candidate1Id.toString()}:${candidate2Id.toString()}`,
        candidate1Id,
        candidate2Id,
        nb1IsMoreLeftThan2: 0,
        nbSimilar: 0,
        nb1IsMoreRightThan2: 0
      }).save();
    } catch (error) {
      console.log("Failed to create an encounter tracker: " + error.message);
    }
  }
};

module.exports = mongoose.model('EncounterTracker', trackerSchema);
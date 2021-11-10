const EncounterTracker = require("../resources/EncounterTracker");
  
  
/**
 * @param {ObjectId} candidate1Id 
 * @param {ObjectId} candidate2Id 
 * @returns A query object used to get the tracker for the two given candidates.
 */
buildQuery = (candidate1Id, candidate2Id) => {
  return {
    _id: {
      $in: [
        `${candidate1Id.toString()}:${candidate2Id.toString()}`,
        `${candidate2Id.toString()}:${candidate1Id.toString()}`
      ]
    }
  };
};

/**
 * @param {ObjectId} candidate1Id 
 * @param {ObjectId} candidate2Id
 * @returns True if the tracker for the two candidates exists in db, false otherwise.
 */
exports.checkIfExists = async (candidate1Id, candidate2Id) => {
  try {
    return await EncounterTracker.exists(buildQuery(candidate1Id, candidate2Id));
  } catch (error) {
    console.log("Failed to check if a tracker exists: " + error.message);
    return false;
  }
};

/**
 * @param {ObjectId} candidate1Id 
 * @param {ObjectId} candidate2Id
 * @returns The tracker for the two candidates if it exists in db, null otherwise.
 */
exports.tryGet = async (candidate1Id, candidate2Id) => {
  try {
    return await EncounterTracker.findOne(buildQuery(candidate1Id, candidate2Id));
  } catch (error) {
    console.log("Failed to get a tracker: " + error.message);
    return null;
  }
};

/**
 * @param {ObjectId} candidate1Id 
 * @param {ObjectId} candidate2Id 
 * @returns The created encounter tracker or null if the creation failed.
 */
exports.createOne = async (candidate1Id, candidate2Id) => {
  try {
    if (candidate1Id.equals(candidate2Id)){
      console.log("Two different candidates are required to create an encounter tracker.");
      return null;
    }
    if (await checkIfExists(candidate1Id, candidate2Id)) {
      console.log("The tracker for the two given candidates already exists");
      return null;
    }
    return await new EncounterTracker({
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
};

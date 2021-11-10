export default class TrackerService {
  
  /**
   * @param {ObjectId} candidateIdToTrack 
   * @param {Object} trackersMap Keys need to be strings of the form candidate1Id:candidate2Id.
   * Values are objects with the properties nb1IsMoreLeftThan2, nbSimilar, nb1IsMoreRightThan2.
   */
  constructor(candidateIdToTrack, trackersMap){
    this.candidateId = candidateIdToTrack;
    this.trackersMap = new Map(Object.entries(trackersMap));
  }

  /**
   * Returns the left, neutral and right ratios against one peticular other candidate.
   * @param {ObjectId} opponentId 
   * @returns {Object} Object with properties left, neutral and right. Null if the two 
   * candidates never encountered each other or if the given opponent Id is the current candidate Id.
   */
  getRatiosAgainstCandidate(opponentId) { 
    if (this.candidateId == opponentId){
      return null;
    }
    let inverted = false;
    let trackerKey = this.candidateId + ":" + opponentId;
    if (!this.trackersMap.has(trackerKey)) {
      trackerKey = opponentId + ":" + this.candidateId;
      inverted = true;
    }
    let ratios = null;
    const trackerValue = this.trackersMap.get(trackerKey);
    if (trackerValue != null) {
      let totalEncounters = trackerValue.nb1IsMoreLeftThan2 + trackerValue.nb1IsMoreRightThan2 + trackerValue.nbSimilar;
      ratios = {
        left: trackerValue.nb1IsMoreLeftThan2 / totalEncounters,
        neutral: trackerValue.nbSimilar / totalEncounters,
        right: trackerValue.nb1IsMoreRightThan2 / totalEncounters
      }
    }
    if (inverted && ratios != null) {
      ratios = {
        left: ratios.right,
        neutral: ratios.neutral,
        right: ratios.left,
      }
    }
    return ratios;
  }

  /**
   * Returns true if the candidate to track has encountered the given opponent at least once.
   * @param {ObjectId} opponentId 
   */
  hasEverEncounteredCandidate(opponentId) { 
    return this.getRatiosAgainstCandidate(opponentId) != null;
  }

  /**
   * Returns the total number of past encounters involving the candidate to track. 
   */
  getTotalEncounters() {
    let total = 0;
    for (const [key, trackerValue] of this.trackersMap.entries()) {
      if (!key.split(":").includes(this.candidateId)) {
        continue;
      }
      total += trackerValue.nb1IsMoreLeftThan2 + trackerValue.nb1IsMoreRightThan2 + trackerValue.nbSimilar;
    }
    return total;
  }
}
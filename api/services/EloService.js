const Encounter = require("../resources/Encounter");
const { EncounterResult, EncounterResultItem } = require("../resources/EncounterResult");
const Candidate = require("../resources/Candidate");

class EloService {

  static BASE = 400;

  static COEF = 10;

  /**
   * Update the candidates' scores according to the outcome of the encounter
   * @param {EncounterResult} result 
   */
  static async SubmitEncounterResult(result) {
    return new Promise(async (resolve, reject) => {
      try {
        await Promise.all(result.items.map(async item => {
          let candidate = await Candidate.findById(item.candidateId);
          if (!candidate) {
            reject(new Error(`Unable to find candidate of id ${item.candidateId}.`));
            return;
          }
          candidate.score += item.scoreDiff;
          await Candidate.updateOne({ _id: item.candidateId }, candidate);
        }));
        resolve(`Successfully submitted ${result.items.length} encounter results.`);
      } catch (error) {
        reject(new Error("Failed to submit the encounter result: " + error.message));
      }
    });
  }

  /**
   * Return a EncounterResult object that can then submitted to the database to update candadites' scores.
   * @param  {Encounter} encounter 
   * @return {EncounterResult}
   */
  static async ComputeEncounterResults(encounter){
    return new Promise(async (resolve, reject) => {
      try {
        let candidate1 = await Candidate.findById(encounter.candidate1Id);
        let candidate2 = await Candidate.findById(encounter.candidate2Id);
        let p = this.GetProbablity(candidate1, candidate2);
        let item1 = new EncounterResultItem(candidate1._id, this.GetScoreUpdate( encounter.outcome, p    ));
        let item2 = new EncounterResultItem(candidate2._id, this.GetScoreUpdate(-encounter.outcome, 1 - p));
        resolve(new EncounterResult(item1, item2));
      } catch (error) {
        reject(new Error("Failed to compute encounter result: " + error.message));
      }
    });
  }

  /**
   * Return the probablity that candidate 1 will be judged more the left than candidate 2.
   * @param {Candidate} candidate1 
   * @param {Candidate} candidate2 
   * @returns {Number} must be between 0 and 1.
   */
  static GetProbablity(candidate1, candidate2){
    let diff = candidate1.score - candidate2.score;
    return 1. / (1. + Math.pow(10, (-diff / this.BASE)));
  }

  /**
   * Get the score difference after the encounter is accounted for. 
   * @param {Number} outcome must be either -1, 0 or 1.
   * @param {Number} probablity must be between 0 and 1.
   * @returns the difference to apply the candidate's score. Can be either positive or negative.
   */
  static GetScoreUpdate(outcome, probablity){
    outcome = (outcome + 1) / 2; // transforming int outcome to a 0, 0.5 or 1 value for the Elo formula
    return this.COEF * (outcome - probablity);
  }
}

module.exports = EloService;
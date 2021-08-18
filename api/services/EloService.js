const { Encounter, CheckOutcomeValidity } = require("../resources/Encounter");
const { EncounterResult, EncounterResultItem } = require("../resources/EncounterResult");
const Candidate = require("../resources/Candidate");

class EloService {

  static BASE = 400;

  static COEF = 10;

  /**
   * Return a EncounterResult object than can then submitted to the database to update candadites' scores.
   * @param  {Encounter} encounter 
   * @return {EncounterResult}
   */
  static ComputeEncounterResults(encounter){
    let candidate1 = new Candidate(encounter.candidate1Id);
    let candidate2 = new Candidate(encounter.candidate2Id);
    let p = this.GetProbablity(candidate1, candidate2);
    let item1 = new EncounterResultItem(candidate1.Id, this.GetScoreUpdate( encounter.outcome, p    ));
    let item2 = new EncounterResultItem(candidate2.Id, this.GetScoreUpdate(-encounter.outcome, 1 - p));
    return new EncounterResult(item1, item2);
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
    CheckOutcomeValidity(outcome);
    outcome = (outcome + 1) / 2; // transforming int outcome to a 0, 0.5 or 1 value for the Elo formula
    return this.COEF * (outcome - probablity);
  }
}

module.exports = EloService;
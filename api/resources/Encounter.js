
export default class Encounter {
  constructor(candidate1Id, candidate2Id, outcome){
    this.candidate1Id = candidate1Id;
    this.candidate2Id = candidate2Id;
    CheckOutcomeValidity(outcome);
    this.outcome = outcome;
  }
}

let CheckOutcomeValidity = function(outcome) {
  // 1 if candidate1 is judged more left-leaning than candidate2
  // 0 if candidate1 is judged similar to candidate2
  // -1 if candidate1 is judged more right-leaning than candidate2
  if (outcome !== 1 && outcome !== 0 && outcome !== -1){
    throw new Error(`Unsupported outcome value (${outcome}) for Encounter.`);
  }
}

export { CheckOutcomeValidity };
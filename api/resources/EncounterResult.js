export default class EncounterResult {
  constructor(item1, item2){
    this.items = [item1, item2];
  }
}

class EncounterResultItem {
  constructor(candidateId, scoreDiff){
    this.candidateId = candidateId;
    this.scoreDiff = scoreDiff;
  }
}

export { EncounterResultItem };
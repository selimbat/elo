const Candidate = require('../resources/Candidate');
const Encounter = require('../resources/Encounter');
const EloService = require('../services/EloService');

describe("Elo service", () => {
  
  test.todo("more test cases (not hardcoded).");

  test("The sum of all scores stays 0.", () => {
    let result = EloService.ComputeEncounterResults(new Encounter({
      candidate1Id: 1,
      candidate2Id: 3,
      outcome: 1,
      originId: null
    }));
    expect(result.items).toBeDefined();
    expect(result.items.length).toEqual(2);
    expect(result.items[0].scoreDiff).toEqual(-result.items[1].scoreDiff);
  });

  test("The probability is between 1 and 0", () => {
    let candidate1 = Candidate.findOne({ _id: 1 });
    let candidate2 = Candidate.findOne({ _id: 3 });
    let p = EloService.GetProbablity(candidate1, candidate2);
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1);
  });

  test("The probablity estimator is symmetrical", () => {
    let candidate1 = Candidate.findOne({ _id: 1 });
    let candidate2 = Candidate.findOne({ _id: 3 });
    let p = EloService.GetProbablity(candidate1, candidate2);
    let pSym = EloService.GetProbablity(candidate2, candidate1);
    expect(Math.abs(1 - (p + pSym))).toBeLessThanOrEqual(1e-14); // dirty workaround for floating point errors
  })
})
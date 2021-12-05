const Candidate = require('../resources/Candidate.js');
const Encounter = require('../resources/Encounter.js');
const EloService = require('../services/EloService.js');
const mongoose = require('mongoose');

describe("Elo service", () => {

  jest.setTimeout(20000);

  test.only("The sum of all scores stays 0.", async () => {
    console.log(`connection established: ${mongoose.connection != null}`);
    let candidates = await Candidate.find();
    console.log("candidates: " + candidates != null);
    expect(candidates).toBeDefined();
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates.map(c => c.score).reduce((a, b) => a + b)).toBe(0);
  });
  /*
  test("Adding an encounter keeps the total score at zero", async () => {
      let result = await EloService.ComputeEncounterResults(new Encounter({
      candidate1Id: "lassalle",
      candidate2Id: "le-pen",
      outcome: 1,
      originId: null
    }));
    expect(result.items).toBeDefined();
    expect(result.items.length).toEqual(2);
    expect(result.items[0].scoreDiff).toEqual(-result.items[1].scoreDiff);
  });
  
  test("The probability is between 1 and 0", async () => {
    let candidate1 = Candidate.findById("melenchon");
    let candidate2 = Candidate.findById("poutou");
    let p = EloService.GetProbablity(await candidate1, await candidate2);
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1);
  });
  
  test("The probablity estimator is symmetrical", async () => {
    let candidate1 = await Candidate.findById("pecresse");
    let candidate2 = await Candidate.findById("jadot");
    let p = EloService.GetProbablity(candidate1, candidate2);
    let pSym = EloService.GetProbablity(candidate2, candidate1);
    expect(Math.abs(1 - (p + pSym))).toBeLessThanOrEqual(1e-14); // dirty workaround for floating point errors
  });
  */
})
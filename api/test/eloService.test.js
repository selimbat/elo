import Candidate from "../resources/Candidate";
import Encounter from "../resources/Encounter";
import EloService from "../services/EloService";

describe("Elo service", () => {
  
  test.todo("more test cases (not hardcoded).");

  test("The sum of all scores stays 0.", () => {
    let result = EloService.ComputeEncounterResults(new Encounter(1, 3, 1));
    expect(result.items).toBeDefined();
    expect(result.items.length).toEqual(2);
    expect(result.items[0].scoreDiff).toEqual(-result.items[1].scoreDiff);
  });

  test("The probability is between 1 and 0", () => {
    let candidate1 = new Candidate(1);
    let candidate2 = new Candidate(3);
    let p = EloService.GetProbablity(candidate1, candidate2);
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1);
  });

  test("The probablity estimator is symmetrical", () => {
    let candidate1 = new Candidate(1);
    let candidate2 = new Candidate(3);
    let p = EloService.GetProbablity(candidate1, candidate2);
    let pSym = EloService.GetProbablity(candidate2, candidate1);
    expect(Math.abs(1 - (p + pSym))).toBeLessThanOrEqual(1e-14); // dirty workaround for floating point errors
  })
})
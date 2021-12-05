const { getNeverSeenRandomTwo } = require("../controllers/Candidate.js");

describe("Candidate controller tests", () => {

  test.todo("todo");
  /*
  test("Always serve a never seen encounter if possible", () => {
    let cookie = {
      "lassalle:le-pen": 1,
    };
    let [candidate1, candidate2] = getNeverSeenRandomTwo(JSON.stringify(cookie));
    let key = `${candidate1._id}:${candidate2._id}`;
    expect(cookie.hasOwnProperty(key)).toBeFalsy();
    key = `${candidate2._id}:${candidate1._id}`;
    expect(cookie.hasOwnProperty(key)).toBeFalsy();
  });
  */
})
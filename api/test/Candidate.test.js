const { getNeverSeenRandomTwo } = require("../controllers/Candidate.js");

module.exports = [
  {
    key: "Always serve a never seen encounter if possible", 
    fn: async () => {
      let cookie = {
        "lassalle:le-pen": 1,
      };
      let [candidate1, candidate2] = await getNeverSeenRandomTwo(JSON.stringify(cookie));
      let key = `${candidate1._id}:${candidate2._id}`;
      expect(cookie.hasOwnProperty(key)).toBeFalsy();
      key = `${candidate2._id}:${candidate1._id}`;
      expect(cookie.hasOwnProperty(key)).toBeFalsy();
    }
  }
];

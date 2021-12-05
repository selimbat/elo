const Candidate = require('../resources/Candidate.js');
const { getNeverSeenRandomTwo } = require("../controllers/Candidate.js");

module.exports = [
  {
    key: "Always serve a never seen encounter if possible", 
    fn: async () => {
      let candidates = await Candidate.find();
      // Build the cookie of all possible pairs
      let cookie = {};
      const n = candidates.length;
      for (let i = 0; i < n; i++) {
        const c1 = candidates[i];
        for (let j = i + 1; j < n; j++) {
          const c2 = candidates[j];
          cookie[`${c1._id}:${c2._id}`] = 1;
        }
      }
      expect(Object.entries(cookie).length).toBe(n * (n - 1) / 2);

      // remove a random encounter from the cookie
      let c1Id = candidates[Math.floor(Math.random() * n)]._id;
      let c2Id;
      do {
        c2Id = candidates[Math.floor(Math.random() * n)]._id;
      } while (c2Id == c1Id);
      let key = `${c1Id}:${c2Id}`;
      if (!cookie.hasOwnProperty(key)) {
        key = `${c2Id}:${c1Id}`;
      }
      expect(cookie.hasOwnProperty(key)).toBe(true);
      delete cookie[key];
      
      // the returned two candidates must match the removed encounter
      let [c1Result, c2Result] = await getNeverSeenRandomTwo(JSON.stringify(cookie));
      console.log(`removed encounter between ${c1Id} and ${c2Id}. \n Got ${c1Result._id} and ${c2Result._id}.`);
      expect(c1Result._id == c1Id || c1Result._id == c2Id).toBe(true);
      expect(c2Result._id == c1Id || c2Result._id == c2Id).toBe(true);
    }
  }
];

const mongoose = require('mongoose');
const scrapper = require('../services/CandidatesScrapperService');

const candidateSchema = mongoose.Schema({
  name: { type: String, required: true },
  birthdate: { type: Date },
  score: { type: Number, required: true },
  imgUrl: { type: String, required: true },
  wikipediaUrl: { type: String },
  occupations: [{ 
    label: { type: String, required: true },
    since: { type: Date } 
  }],
  party: {
    name: { type: String, required: true },
    wikipediaUrl: { type: String }
  },
  desciption: { type: String }
});

candidateSchema.methods = {
  initCandidates: async () => {
    let candidates = await scrapper.getCandidatesFromWikipedia();
    for(let i = 0; i < candidates.length; i++) {
      candidates[i].score = 0;
    }
    return mongoose.model('Candidate').insertMany(candidates, err => {
      if (err){
          return console.error(err);
      }
      console.log("Initial candidates inserted to Collection.");
    });
  }
};

module.exports = mongoose.model('Candidate', candidateSchema);
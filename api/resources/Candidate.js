const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  birthdate: { type: Date },
  score: { type: Number, required: true },
  imgUrl: { type: String, required: true },
  wikipediaUrl: { type: String },
  occupations: [{ 
    label: { type: String, required: true },
    since: { type: Number } 
  }],
  party: {
    name: { type: String, required: true },
    wikipediaUrl: { type: String }
  },
  description: { type: String }
});

candidateSchema.statics = {
  initCandidates: async (source, submit) => {
    let candidates = await source.getCandidates();
    for(let i = 0; i < candidates.length; i++) {
      candidates[i].score = 0;
    }
    if (submit){
      try {
        await mongoose.model('Candidate').insertMany(candidates);
        console.log("Initial candidates inserted to Collection.");
      } catch (err) {
        console.log("Failed to insert candidates: " + err.message);
      }
    }
  }
};

module.exports = mongoose.model('Candidate', candidateSchema);
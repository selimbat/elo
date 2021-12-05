const mongoose = require('mongoose');

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { 
    type: String,
    required: true,
    set: function(v) {
      if (this.isNew) {
        // Set the id as the lastname without the accents and diacritics.
        this._id = v.toLowerCase().normalize("NFD").replace(/\s+/g, "-").replace(/[\u0300-\u036f]/g, "");
      }
      return v;
    }
  },
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

schema.statics = {
  initCandidates: async (source, submit, isTestContext = false) => {
    let candidates = await source.getCandidates(isTestContext);
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

module.exports = mongoose.model('Candidate', schema);
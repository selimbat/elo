const mongoose = require('mongoose');

const lastNameToId = (lastname) => {
  return lastname.toLowerCase().normalize("NFD").replace(/\s+/g, "-").replace(/[\u0300-\u036f]/g, "");
}

const schema = mongoose.Schema({
  _id: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { 
    type: String,
    required: true,
    set: function(v) {
      if (this.isNew) {
        // Set the id as the lastname without the accents and diacritics.
        this._id = lastNameToId(v);
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
  initCandidates: async (source) => {
    if (!await mongoose.model('Candidate').findOne({})) {
      console.log("Candidate collection is empty. Populating it from local json.")
      let candidates = await source.getCandidates();
      candidates = candidates.map(c => { return { ...c, score: 0 }});
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
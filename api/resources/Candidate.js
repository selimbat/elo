const mongoose = require('mongoose');

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

module.exports = mongoose.model('Candidate', candidateSchema);
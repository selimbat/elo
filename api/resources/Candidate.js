const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema({
  name: { type: String, required: true },
  birthdate: { type: Date },
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

const placeholders = [
  {
    id: '1',
    firstname: "Michel",
    lastname: "Dupont",
    party: "parti A",
    score: 1200
  },
  {
    id: '2',
    firstname: "Martine",
    lastname: "Dubois",
    party: "parti B",
    score: -2105
  },
  {
    id: '3',
    firstname: "Mohamed",
    lastname: "Ben Barbour",
    party: "parti C",
    score: 230
  },
  {
    id: '4',
    firstname: "Jean",
    lastname: "Bonbeurre",
    party: "parti D",
    score: -1230
  },
  {
    id: '5',
    firstname: "Sami",
    lastname: "Ritte",
    party: "parti E",
    score: 5490
  },
];

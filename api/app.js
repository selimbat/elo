require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Candidate = require('./resources/Candidate');
const Encounter = require('./resources/Encounter');
const EloService = require('./services/EloService');

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mlx2e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(() => console.log("Failed to connect to MongoDB"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

app.get('/api/candidates', (req, res, next) => {
  Candidate.find()
    .then(candidates => res.status(200).json(candidates))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/candidate/:id', (req, res, next) => {
  Candidate.findOne({ _id: req.params.id })
    .then(candidate => res.status(200).json(candidate))
    .catch(error => res.status(404).json({ error }));
});
/*
app.post('/api/candidate', (req, res, next) => {
  delete req.body._id;
  const candidate = new Candidate({
    ...req.body
  });
  candidate.score = 0;
  candidate.save()
    .then(() => res.status(201).json({ message: `Candidat '${candidate.name}' enregistré !`}))
    .catch(error => res.status(400).json({ error }));
});
*/
app.post('/api/encounter', async (req, res, next) => {
  try {
    delete req.body._id;
    const encounter = new Encounter({
      ...req.body
    });
    await encounter.save();
    let encounterResult = await EloService.ComputeEncounterResults(encounter);
    await EloService.SubmitEncounterResult(encounterResult);
    res.status(200).json({
      message: `Encounter between candidates of id ${encounterResult.items[0].candidateId} and ${encounterResult.items[1].candidateId} succeffully registered. The winner gained ${Math.abs(encounterResult.items[0].scoreDiff)}`
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});
  
module.exports = app;
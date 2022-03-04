const express = require('express');
const db = require('./db');
const path = require('path');
const candidateRouter = require('./routers/Candidate');
const encounterRouter = require('./routers/Encounter');
const Candidate = require("./resources/Candidate");
const { promises: fs } = require('fs');

db.connect();

Candidate.initCandidates({
  getCandidates: async () => {
    try {
      return JSON.parse(await fs.readFile(path.join(__dirname, "public", "candidates.json")));
    } catch (error) {
      console.log(error);
    }
  }
});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Content-Security-Policy', 'default-src \'self\'');
  next();
});

app.use("/public", express.static("public"));

app.use("/api/candidates", candidateRouter);
app.use("/api/encounter", encounterRouter);
  
module.exports = app;
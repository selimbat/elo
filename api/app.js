const express = require('express');
const db = require('./db');
const candidateRouter = require('./routers/candidate');
const encounterRouter = require('./routers/Encounter');

db.connect();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

app.use("/api/candidates", candidateRouter);
app.use("/api/encounter", encounterRouter);
  
module.exports = app;
const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.get('/api/candidates', (req, res, next) => {
  const candidates = [
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
  ];
  res.status(200).json(candidates);
});

app.post('/api/match', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "Match créé !"
  })
});

module.exports = app;
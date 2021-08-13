const express = require('express');

const app = express();

app.use('/api/candidates', (req, res, next) => {
  const candidates = [
    {
      id: '1',
      firstname: "Michel",
      lastname: "Dupont",
      party: "parti A",
      score: 1200
    },
    {
      id: '1',
      firstname: "Martine",
      lastname: "Dubois",
      party: "parti B",
      score: -2105
    },
  ];
  res.status(200).json(candidates);
});

module.exports = app;
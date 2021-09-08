require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const candidateRouter = require('./routers/candidate');
const encounterRouter = require('./routers/Encounter');

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

app.use("/api/candidates", candidateRouter);
app.use("/api/encounter", encounterRouter);
  
module.exports = app;
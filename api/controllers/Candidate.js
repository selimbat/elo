const Candidate = require("../resources/Candidate");

const init = () => {
  Candidate.findOne({}, async (err,doc) => {
    if (err){
      console.log(err);
      return;
    }
    if(!doc){
      const candidate = new Candidate();
      await candidate.initCandidates();
    }
  });
};
init();
    
exports.getAll = (req, res, next) => {
  Candidate.find()
    .then(candidates => res.status(200).json(candidates))
    .catch(error => res.status(400).json({ error }));
};

exports.getRandomTwo = (req, res, next) => {
  try {
    Candidate.countDocuments(async (err, count) => {
      if (err) {
        throw err;
      }
      let rand = Math.floor(Math.random() * count);
      let candidate1 = await Candidate.findOne().skip(rand);
      let candidate2;
      do {
        rand = Math.floor(Math.random() * count);
        candidate2 = await Candidate.findOne().skip(rand);
      } while (candidate2._id == candidate1._id);
      res.status(200).json([candidate1, candidate2]);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getOneById =  (req, res, next) => {
  Candidate.findOne({ _id: req.params.id })
    .then(candidate => res.status(200).json(candidate))
    .catch(error => res.status(404).json({ error }));
};

exports.createOne = (req, res, next) => {
  delete req.body._id;
  const candidate = new Candidate({
    ...req.body
  });
  candidate.score = 0;
  candidate.save()
    .then(() => res.status(201).json({ message: `Candidat '${candidate.name}' enregistré !`}))
    .catch(error => res.status(400).json({ error }));
};
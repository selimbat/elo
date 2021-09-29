const Candidate = require("../resources/Candidate");

resolveImgUrl = (protocol, host, candidate) => {
  let imgUrl = candidate.imgUrl;
  if (imgUrl.length > 0 && imgUrl[0] === "."){ // remove the first dot of the relative path
    imgUrl = imgUrl.substring(1);
  }
  candidate.imgUrl = `${protocol}://${host}${imgUrl}`;
}

exports.getAll = (req, res, next) => {
  Candidate.find()
    .then(candidates => {
      candidates.forEach((c) => resolveImgUrl(req.protocol, req.get("host"), c));
      res.status(200).json(candidates);
    })
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
      resolveImgUrl(req.protocol, req.get("host"), candidate1);
      resolveImgUrl(req.protocol, req.get("host"), candidate2);
      res.status(200).json([candidate1, candidate2]);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getOneById =  (req, res, next) => {
  Candidate.findOne({ _id: req.params.id })
    .then(candidate => {
      resolveImgUrl(req.protocol, req.get("host"), candidate);
      res.status(200).json(candidate);
    })
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
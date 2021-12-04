const { all } = require("../app");
const Candidate = require("../resources/Candidate");
const EncounterTracker = require("../resources/EncounterTracker");

resolveImgUrl = (protocol, host, candidate) => {
  let imgUrl = candidate.imgUrl;
  if (imgUrl.length > 0 && imgUrl[0] === "."){ // remove the first dot of the relative path
    imgUrl = imgUrl.substring(1);
  }
  candidate.imgUrl = `${protocol}://${host}${imgUrl}`;
}

exports.getAll = async (req, res, next) => {
  try {
    let candidates = await Candidate.find();
    candidates.forEach((c) => resolveImgUrl(req.protocol, req.get("host"), c));
    let trackersMap = {};
    (await EncounterTracker.find()).forEach((t) => {
      const { nb1IsMoreLeftThan2, nbSimilar, nb1IsMoreRightThan2 } = t;
      trackersMap[`${t.candidate1Id}:${t.candidate2Id}`] = { 
        nb1IsMoreLeftThan2,
        nbSimilar,
        nb1IsMoreRightThan2
      };
    });
    res.status(200).json({ candidates, trackersMap });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getRandomTwo = async (req, res, next) => {
  try {
      let candidates = await Candidate.find();
      // generate a matrix of all possible 1v1 combinations.
      let allowedEncounters = Object.fromEntries(
        candidates.map(c => [
          c._id,
          candidates.filter(o => !o._id == c._id).map(o => o._id)
        ])
      );
      if (req.query.seenEncountersCookie){
        let seenEncountersCookie = JSON.parse(req.query.seenEncountersCookie);
        // remove from the matrix the combinations that have been shown to the user.
        Object.keys(seenEncountersCookie).forEach(key => {
          let [candidate1Id, candidate2Id] = key.split(":");
          allowedEncounters[candidate1Id] = allowedEncounters[candidate1Id].filter(id => id != candidate2Id);
          allowedEncounters[candidate2Id] = allowedEncounters[candidate2Id].filter(id => id != candidate1Id);
        });
      }
      let candidate1Id, candidate2Id;
      if (Object.values(allowedEncounters).map(o => o.length).reduce((a,b) => a + b) == 0) {
        // all combinations have been shown to the user, show any random combination.
        let rand = Math.floor(Math.random() * Object.keys(allowedEncounters).length);
        candidate1Id = Object.keys(allowedEncounters)[rand];
        do {
          rand = Math.floor(Math.random() * Object.keys(allowedEncounters).length);
          candidate2Id = Object.keys(allowedEncounters)[rand];
        } while (candidate1Id == candidate2Id);
      }
      else {
        // some combinaitions are still possible, choose one among them.
        allowedEncounters = Object.fromEntries(Object.entries(allowedEncounters).filter(entry => entry[1].length > 0));
        let rand = Math.floor(Math.random() * Object.keys(allowedEncounters).length);
        candidate1Id = Object.keys(allowedEncounters)[rand];
        rand = Math.floor(Math.random() * allowedEncounters[candidate1Id].length);
        candidate2Id = allowedEncounters[candidate1Id][rand];
      }
      let candidate1 = await Candidate.findById(candidate1Id);
      let candidate2 = await Candidate.findById(candidate2Id);
      resolveImgUrl(req.protocol, req.get("host"), candidate1);
      resolveImgUrl(req.protocol, req.get("host"), candidate2);
      res.status(200).json([candidate1, candidate2]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.getOneById =  async (req, res, next) => {
  try {
    let candidate = await Candidate.findById(req.params.id);
    resolveImgUrl(req.protocol, req.get("host"), candidate);
    res.status(200).json(candidate);
  } catch (error) {
    res.status(404).json({ error });
  }
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
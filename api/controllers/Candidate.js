const Candidate = require("../resources/Candidate");
const EncounterTracker = require("../resources/EncounterTracker");
const GraphService = require("../services/GraphService.js");

resolveImgUrl = (protocol, host, candidate) => {
  let imgUrl = candidate.imgUrl;
  if (imgUrl.length > 0 && imgUrl[0] === "."){ // remove the first dot of the relative path
    imgUrl = imgUrl.substring(1);
  }
  if (imgUrl.length > 0 && imgUrl[0] !== "/"){ // add a slash if it is missing
    imgUrl = `/${imgUrl}`;
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
    let path = null;
    if (req.query.seenEncountersCookie) {
      let graph = new GraphService(candidates);
      graph.buildFromCookie(req.query.seenEncountersCookie);
      path = graph.getTraversalPath()?.path;
    }
    res.status(200).json({ candidates, trackersMap, path });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getRandomTwo = async (req, res, next) => {
  try {
    let [candidate1, candidate2] = await exports.getNeverSeenRandomTwo(req.query.seenEncountersCookie);
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

// testable functions

exports.getNeverSeenRandomTwo = async (seenEncountersCookieStr) => {
  let candidates = await Candidate.find();
  let graph = new GraphService(candidates);
  graph.buildFromCookie(seenEncountersCookieStr);
  let { missingTransition } = graph.getTraversalPathOrMissingTransition();
  let [c1Id, c2Id] = missingTransition;
  return [await Candidate.findById(c1Id), await Candidate.findById(c2Id)];
};
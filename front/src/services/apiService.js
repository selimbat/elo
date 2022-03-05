const axios = require("axios");

const buildAPIRoute = (path, isStatic = false) => {
  return `${process.env.VUE_APP_API_HOST}${isStatic ? '' : '/api'}${path}`;
}

exports.getAllCandidates = async (seenEncountersCookie) => {
  try {
    const response = await axios.get(buildAPIRoute("/candidates"), {
      params: { seenEncountersCookie}
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

exports.postEncounter = async (candidate1Id, candidate2Id, outcome) => {
  try {
    const encounterToPost = {
      candidate1Id: candidate1Id,
      candidate2Id: candidate2Id,
      outcome: outcome,
    };
    const response = await axios.post(buildAPIRoute("/encounter"), encounterToPost);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

exports.getTwoRandomCandidates = async (seenEncountersCookie) => {
  try {
    const response = await axios.get(buildAPIRoute("/candidates/random-two"), {
      params: { seenEncountersCookie }
    });
    if (response.data.length != 2) {
      console.error("The server doesn't send two candidates.");
      return;
    }
    return [response.data[0], response.data[1]];
  } catch (error) {
    console.error(error);
  }
}

exports.getAverageEncountersUntilOrdered = async () => {
  try {
    const response = await axios.get(buildAPIRoute("/averageEncountersUntilOrdering.json", true));
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
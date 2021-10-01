const axios = require("axios");

exports.getAllCandidates = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/candidates");
    return response.data.sort((c1, c2) => c1.score < c2.score);
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
      originIPAddress: "TODO: Find a way to get the ip",
    };
    await axios.post("http://localhost:3000/api/encounter", encounterToPost);
  } catch (error) {
    console.error(error);
  }
}

exports.getTwoRandomCandidates = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/candidates/random-two");
    if (response.data.length != 2) {
      console.error("The server doesn't send two candidates.");
      return;
    }
    return [response.data[0], response.data[1]];
  } catch (error) {
    console.error(error);
  }
}
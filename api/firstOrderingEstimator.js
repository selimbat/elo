const GraphService = require('./services/GraphService.js');
const { promises: fs } = require('fs');

let computeAverageEncountersUtilOrdering = () => {
  console.log("Starting to compute average encounters until ordering.");
  let averagesByN = {};
  for (let N = 4; N <= 15; N++) {
    let overallEncounters = 0;
    let nbSampling = 30;
    for (let i = 0; i < nbSampling; i++){
      let graph = new GraphService(Array.from({length: N}, (_, i) => {return {_id: i}}));
      
      let ordered = false;
      let encountersUntilOrdered = 0;
      do {
        let { path, missingTransition } = graph.getTraversalPathOrMissingTransition();
        if (path) {
          ordered = true;
        }
        else {
          let randomOutcome = Math.random() < 0.5 ? 0 : 1;
          graph.addTransition(missingTransition[0], missingTransition[1], randomOutcome);
        }
        encountersUntilOrdered++;
      } while (!ordered && encountersUntilOrdered < N * N);
      
      overallEncounters += encountersUntilOrdered
    }
    averagesByN[N] = overallEncounters / nbSampling;
  }
  console.log("Done.");
  return averagesByN;
}

let writeAverageEncountersUntilOrderingFile = async (averages) => {
  const data = JSON.stringify(averages);
  try {
    await fs.writeFile("./assets/public/averageEncountersUntilOrdering.json", data);
  } catch (err) {
    console.log(`Error writing average encounters file: ${err}`);
    return;
  } 
  console.log("Average encounters file written successfully!");
}

let averages = computeAverageEncountersUtilOrdering();
writeAverageEncountersUntilOrderingFile(averages);
  
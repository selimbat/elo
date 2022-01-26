const GraphService = require('../services/GraphService.js');

module.exports = [
  {
    key: "A graph service should always either have a traversal path of suggest a transition.",
    fn: () => {
      let candidates = [
        { _id:"1" },
        { _id:"2" },
        { _id:"3" },
        { _id:"4" },
        { _id:"5" },
        { _id:"6" },
        { _id:"7" },
      ];
      let graph = new GraphService(candidates);
      for (let i = 0; i < 10; i++) {
        let [c1Id, c2Id] = graph.getRandomPair();
        if (Math.random() < 0.5) {
          let tmp = c1Id;
          c1Id = c2Id;
          c2Id = tmp;
        }
        graph.addTransition(c1Id, c2Id);
      }
      let result = graph.getTraversalPathOrMissingTransition();
      expect(result.path || result.missingTransition).toBeTruthy();
      if (result.missingTransition) {
        expect(result.missingTransition.length).toBe(2);
      }
    }
  },
  {
    key: "A graph service shouldn't suggest a transition that is already connected.",
    fn: () => {
      let candidates = [
        { _id:"1" },
        { _id:"2" },
        { _id:"3" },
        { _id:"4" },
        { _id:"5" },
        { _id:"6" },
        { _id:"7" },
      ];
      let graph = new GraphService(candidates);
      for (let i = 0; i < 10; i++) {
        let [c1Id, c2Id] = graph.getRandomPair();
        if (Math.random() < 0.5) {
          let tmp = c1Id;
          c1Id = c2Id;
          c2Id = tmp;
        }
        graph.addTransition(c1Id, c2Id);
      }
      let result = graph.getTraversalPathOrMissingTransition();
      if (result.missingTransition) {
        let path = graph.getPathBetweenTwoNodes(result.missingTransition[0], result.missingTransition[1], true).path;
        expect(path).toBeFalsy();
      }
    }
  }
];
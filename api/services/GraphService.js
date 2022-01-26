// describes the graph of candidates being built by the user.

class GraphService {
  constructor(candidates) {
    this.candidates = candidates;
    this.N = candidates.length;
    // Initialize the matrix of all transitions.
    // each entry is made of a key wich is a candidate Id and a list of all more right-leaning candidates than the key.
    this.transitions = Object.fromEntries(
      candidates.map(i => 
        [i._id, []]
      )
    );
  }

  buildFromCookie(cookieStr) {
    if (!cookieStr){
      return;
    }
    let cookie = JSON.parse(cookieStr);
    Object.keys(cookie).forEach(key => {
      let [c1Id, c2Id] = key.split(":");
      if (cookie[key] < 0) {
        let tmp = c1Id;
        c1Id = c2Id;
        c2Id = tmp;
      }
      this.addTransition(c1Id, c2Id);
    });
  }

  /**
   * @param {String} leftCId Id of the left-leaning candidate  
   * @param {String} rightCId Id of the right-leaning candidate
   */
  addTransition(leftCId, rightCId) {
    if (leftCId == rightCId || !this.transitions?.[leftCId] || !rightCId) {
      return;
    }
    let { possibleStartNodes, possibleEndNodes } = getPossibleTerminalNodes();
    // avoid creating a loop and emptying the graph of a unique start and end node.
    if (possibleEndNodes.length == 1 && possibleEndNodes[0] == leftCId) {
      return;
    }
    if (possibleStartNodes.length == 1 && possibleStartNodes[0] == rightCId) {
      return;
    }
    this.transitions[leftCId].push(rightCId);
  }

  /**
   * Get all the more right-leaning candidates directly connected to a candidate
   * @param {String} cId Id of the candidate for wich to fetch all the connected more right-leaning candidates
   */
  getAllNextNodes(cId) {
    return this.transitions?.[cId];
  }

  /**
   * Get all the more left-leaning candidates directly connected to a candidate
   * @param {String} cId Id of the candidate for wich to fetch all the connected more left-leaning candidates
   */
  getAllPreviousNodes(cId) {
    if (this.transitions) {
      return Object.keys(this.transitions).filter(otherCId =>
        otherCId != cId && this.transitions[otherCId].indexOf(cId) >= 0
      );
    }
  }

  getRandomPair() {
    return this.getRandomPairFromSubSet(this.candidates.map(c => c._id));
  }

  getRandomPairFromSubSet(nodes) {
    if (nodes.length < 2) {
      return [undefined, undefined];
    }
    let n1 = nodes[Math.floor(Math.random() * nodes.length)];
    let n2;
    do {
      n2 = nodes[Math.floor(Math.random() * nodes.length)];
    } while (n2 == n1);
    return [n1, n2];
  };

  /**
   * Search the graph (depth first) looking for a traversal path. If none is found, returns a candidate transition that
   * would contribute to having a traversal path.
   * @returns an object with:
   * a 'path' property wich is a list of nodes representing a traversal path of the graph.
   * a 'missingTransition' property wich is a list of exactly two nodes that, if connected, would bring the graph closer to having a traversal path.
   */
  getTraversalPathOrMissingTransition() {
    let { path, allPaths, multipleTerminalNodes, possibleEndNodes, possibleStartNodes } = {
      ...this.getTraversalPath()
    };
    if (path) {
      return { 
        path,
        missingTransition: this.getRandomPair(),
      };
    }
    if (multipleTerminalNodes) {
      let subset = null;
      if (possibleStartNodes?.length >= 2 && possibleEndNodes?.length >= 2) {
        if (Math.random() > 0.5) {
          subset = possibleStartNodes;
        } else {
          subset = possibleEndNodes;
        }
      } else if (possibleStartNodes?.length >= 2) {
        subset = possibleStartNodes;
      } else if (possibleEndNodes?.length >= 2) {
        subset = possibleEndNodes;
      }
      return { missingTransition: this.getRandomPairFromSubSet(subset) };
    }

    // find a transition that would get us closer to finding a traversal
    let orderedPaths = allPaths.sort((a, b) => a.length < b.length ? 1 : -1);
    let diff = {
      onlyInA: [],
      onlyInB: []
    };
    let i = 1;
    while ((!diff.onlyInA.length || !diff.onlyInB.length) && i < orderedPaths.length) {
      diff = {
        onlyInA: [],
        onlyInB: []
      };
      let pathA = new Set(orderedPaths[0]);
      let pathB = new Set(orderedPaths[i]);
      for (let c of pathA) {
        if (!pathB.has(c)) {
          diff.onlyInA.push(c);
        }
      }
      for (let c of pathB) {
        if (!pathA.has(c)) {
          diff.onlyInB.push(c);
        }
      }
      i++;
    }
    return { missingTransition: [
      diff.onlyInA[Math.floor(Math.random() * diff.onlyInA.length)],
      diff.onlyInB[Math.floor(Math.random() * diff.onlyInB.length)]
    ]};
  }

  /**
   * Search the graph (depth first) looking for a traversal 
   * @returns an object with:
   * a 'path' property wich is a list representing a path that visits all nodes.
   * a 'allPaths' property wich is a list of all paths. It is empty if a traversal path was found. 
   * a 'allLoops' property wich is a list of loops. It may not be complete if a traversal path was found. 
   * a 'multipleTerminalNodes' property wich is a boolean that evaluates to true if there are multiple possible start or end nodes. 
   * a 'possibleStartNodes' property wich is a list of all possible start nodes. 
   * a 'possibleEndNodes' property wich is a list of all possible end nodes. 
   */
  getTraversalPath() {
    let { possibleStartNodes, possibleEndNodes } = getPossibleTerminalNodes();
    if (possibleStartNodes.length != 1 || possibleEndNodes.length != 1) {
      return {
        path: null,
        allPaths: [],
        allLoops: [],
        multipleTerminalNodes: true,
        possibleStartNodes,
        possibleEndNodes,
      };
    }
    
    let startNode = possibleStartNodes[0];
    let endNode = possibleEndNodes[0];
    
    return {
      ...this.getPathBetweenTwoNodes(startNode, endNode),
      multipleTerminalNodes: false
    }
  }

  getPossibleTerminalNodes() {
    // possible start nodes are nodes that aren't children of other nodes
    let possibleStartNodes = Object.keys(this.transitions).filter(candidate => {
      for (let children of Object.values(this.transitions)){
        if (children.indexOf(candidate) >= 0) {
          return false; // found a node leading to the current node, so we filter it out
        }
      }
      return true;
    });
    // possible end nodes are nodes that do not lead to any other node
    let possibleEndNodes = Object.entries(this.transitions).filter(children => children[1].length == 0).map(children => children[0]);

    return { possibleStartNodes, possibleEndNodes };
  }

  /**
   * Search the graph (depth first) looking for a path between the two given nodes.
   * @returns an object with:
   * a 'path' property wich is a list representing a possible path between the two nodes.
   * a 'allPaths' property wich is a list of all paths. It is empty if a path was found. 
   * a 'allLoops' property wich is a list of loops. It may not be complete if a path was found. 
   */
  getPathBetweenTwoNodes(startNode, endNode, stopAtFirstPath = false) {
    let allPaths = [];
    let allLoops = [];
    let currentNode = startNode;
    let currentPath = [currentNode];

    while (currentPath.length > 0) {
      let children = this.getAllNextNodes(currentNode);
      if (currentNode == endNode || !children?.length) {
        if (stopAtFirstPath || currentPath.length == this.N) {
          // found a traversal path
          return {
            path: currentPath,
            allPaths: [],
            allLoops: allLoops,
          }
        }
        allPaths.push([...currentPath]);
        currentPath.pop();
        if (currentPath.length > 0) {
          currentNode = currentPath[currentPath.length - 1]; // parent node;
        }
        continue;
      }
      let foundPathNotVisited = false;
      for (let child of children) {
        if (currentPath.indexOf(child) >= 0) {
          // loop detected
          let detectedLoop = [...currentPath.slice(currentPath.indexOf(child))];
          if (!allLoops.some(loop => loop.join(';') == detectedLoop.join(";"))) {
            allLoops.push(detectedLoop);
          }
          continue;
        }
        let eventualPath = [...currentPath, child];
        let visitedPath = false;
        for(let path of allPaths) {
          if (path.slice(0, eventualPath.length).join(';') == eventualPath.join(';')) {
            visitedPath = true;
            break;
          }
        }

        if (!visitedPath) {
          // found a path not yet visited, go down that road
          currentNode = child;
          currentPath.push(child);
          foundPathNotVisited = true;
          break;
        }
      }
      if (!foundPathNotVisited){
        // all children have been visited
        currentPath.pop();
        if (currentPath.length > 0) {
          currentNode = currentPath[currentPath.length - 1]; // parent node;
        }
      }
    }
    return {
      path: null,
      allPaths,
      allLoops,
    };
  }
}

module.exports = GraphService;
const init = require('./Init.js');
const teardown = require('./Teardown.js');

let tests = [
  ...require('./Candidate.test.js'),
  ...require('./EloService.test.js'),
];

describe("All tests", () => {

  jest.setTimeout(20000);

  beforeAll(async () => await init());

  afterAll(async () => await teardown());

  tests.forEach((testItem) => {
    test(testItem.key, testItem.fn);
  });
});
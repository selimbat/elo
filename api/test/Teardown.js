const { teardown } = require('../services/ProvisionningService.js');
const db = require('../db.js');

module.exports = async () => {
  await teardown();
  await db.disconnect();
}
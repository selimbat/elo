const express = require("express");
const router = express.Router();

const controller = require("../controllers/Encounter");

router.post('/', controller.registerOne);

module.exports = router;
const express = require("express");
const router = express.Router();

const controller = require('../controllers/Candidate');

router.get('/', controller.getAll);
router.get('/random-two', controller.getRandomTwo);
router.get('/progress/:nbCandidates?', controller.getUserProgress);
router.get('/:id', controller.getOneById);

module.exports = router;
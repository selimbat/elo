const express = require("express");
const router = express.Router();

const controller = require('../controllers/Candidate');

router.get('/', controller.getAll);
router.get('/random-two', controller.getRandomTwo);
router.get('/:id', controller.getOneById);
//router.post('/', controller.createOne);

module.exports = router;
const express = require("express");
const router = express.Router();
const getanswer = require("../controller/answercontroller");
router.get("/:question_id", getanswer);

module.exports = router;

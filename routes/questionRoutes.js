const express = require("express");
const router = express.Router();
const { AllQuestions,SingleQuestion } = require("../controller/questionController");

// all-question route
router.get("/", AllQuestions);
// single question route
router.get("/:question_id", SingleQuestion);
module.exports = router;

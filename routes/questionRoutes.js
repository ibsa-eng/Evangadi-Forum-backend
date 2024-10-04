const express = require("express");
const router = express.Router();
const { AllQuestions } = require("../questionController");

router.get("/", AllQuestions);
router.get("/:question_id", (req, res) => {
  console.log(req.params);
  question_id = req.params.question_id;
});

module.exports = router;

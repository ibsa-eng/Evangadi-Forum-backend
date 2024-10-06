const express = require("express");
const router = express.Router();
const {
  AllQuestions,
  askQuestion,
} = require("../controller/questionController");
const authMiddleware = require("../middleware/authMiddleware");

// **Get all questions Route**
router.get("/", AllQuestions);
router.get("/:question_id", (req, res) => {
  console.log(req.params);
  question_id = req.params.question_id;
});

// **Post a Question Route**
router.post("/", authMiddleware, askQuestion);

module.exports = router;

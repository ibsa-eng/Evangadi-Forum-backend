const express = require("express");
const router = express.Router();
const {
  AllQuestions,
  askQuestion,
  SingleQuestion,
} = require("../controller/questionController");
const authMiddleware = require("../middleware/authMiddleware");

// **Get all questions Route**
router.get("/", AllQuestions);
router.get("/:question_id", SingleQuestion);

// **Post a Question Route**
router.post("/", authMiddleware, askQuestion);

module.exports = router;

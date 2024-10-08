const express = require("express");
const router = express.Router();

const {
  postAnswer,
  editAnswer,
  deleteAnswer,
} = require("../controller/answerController");

// routes
router.post("/", postAnswer);
router.patch("/:answerId", editAnswer);
router.delete("/:answerId", deleteAnswer);

module.exports = router;

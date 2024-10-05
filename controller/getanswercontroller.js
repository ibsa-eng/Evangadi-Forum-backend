const dbconnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// // gete answer function

async function getanswer(req, res) {
  const question_id = req.params.question_id; 
   try {
    const [answers] = await dbconnection.query(
      "SELECT answer_id, user_name, content FROM answers WHERE question_id = ?",
      [question_id]
    );

    if (answers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No answers found for this question" });
    }

    res.status(StatusCodes.OK).json({ question_id, answers });
  } catch (err) {
    console.log(err.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
}
module.exports = getanswer;

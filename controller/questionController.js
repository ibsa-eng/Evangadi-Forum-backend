const dbConnection = require("../db/dbConfig.js");
const { StatusCodes } = require("http-status-codes");

// ** POST QUESTION Handler
async function askQuestion(req, res) {
  const { title, content } = req.body;

  const user_id = req.user.userid;
  const question_id = req.user.questionid;

  if (!title || !content) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    await dbConnection.query(
      "INSERT INTO questions (question_id, user_id, title, content) VALUES (?, ?, ?, ?)",
      [question_id, user_id, title, content] 
    );

    return res.status(StatusCodes.CREATED).json({
      message: "Question created successfully",
      question_id: question_id, 
    });
  } catch (error) {
    console.log(error); 
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

//** All question handler**
const AllQuestions = async (req, res) => {
  try {
    const selectAllQuestions = "select * from questions";
    const response = await dbConnection.query(selectAllQuestions);
    if (response[0].length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "No questions found.",
      });
    }
    res.status(200).json(response[0]);
    console.log(response[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = { AllQuestions, askQuestion };

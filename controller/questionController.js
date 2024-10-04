const dbConnection = require("../db/dbConfig.js");

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

module.exports = { AllQuestions };

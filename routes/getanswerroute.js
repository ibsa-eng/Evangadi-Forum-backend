const express = require("express");
const router = express.Router();
const dbconnection = require("../db/dbconfig");
const { StatusCodes } = require("http-status-codes");
const getanswer = require("../controller/getanswercontroller");
//
router.get("/:question_id", getanswer);

module.exports = router;

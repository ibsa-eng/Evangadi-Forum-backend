//  db connection
const dbConnection = require("../db/dbConfig.js");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send("please provide all required information!");
  }

  try {
    const [user] = await dbConnection.query(
      "select username, userid from users where username = ? or email = ?",
      [username, email]
    );

    if (user.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "user already exist",
      });
    }
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least 8 characters" });
    }
    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const inserUser =
      "INSERT INTO users(username, firstname, lastname, email, password) values (?,?,?,?,?)";

    await dbConnection.query(inserUser, [
      username,
      firstname,
      lastname,
      email,
      hashedPassword,
    ]);
    return res.status(StatusCodes.CREATED).json({
      mes: "user created successfully",
    });

    // const hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Server error try again later",
    });
  }
};

const login = async (req, res) => {
  const { password, email } = req.body;
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "please provide all required files",
    });
  }
  try {
    const [user] = await dbConnection.query(
      "select username, userid, password from users where email=?",
      [email]
    );
    if (user.length == 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "invalid credentials",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "invalid credentials",
      });
    }
    const { username, userid } = user[0];

    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(StatusCodes.OK).json({
      msg: "user login successful",
      token,
      username,
    });
  } catch (error) {}
};

const checkUser = async (req, res) => {
  const { username, userid } = req.user;

  res.status(StatusCodes.OK).json({ msg: "valid user", username, userid });
};

module.exports = {
  register,
  login,
  checkUser,
};

//  db connection
const dbConnection = require("../db/dbConfig.js");
const bcrypt = require("bcrypt");
const userUtility = require("../utilities/userUtility.js");
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

    const inserUser = "INSERT INTO users(username, firstname, lastname, email, password) values (?,?,?,?,?)";

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

const requestOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const [user] = await dbConnection.query(
      "SELECT * from users WHERE email=?",
      [email]
    );

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "user not found" });
    }

    // generate OTP using userUtility
    const otp = userUtility.generateDigitOTP();

    // for 10 min
    const expireAt = new Date(Date.now() + 10 * 60 * 1000);

    // store the otp and expiration on database
    await dbConnection.query(
      "UPDATE users SET otp =?, otp_expires=? WHERE email=?",
      [otp, expireAt, email]
    );

    // send the otp using via email using userUtility
    await userUtility.sendEmail(email, otp);
    res.status(StatusCodes.OK).json({ msg: "OTP sent to your email address" });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Server error, Please try again later.",
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  // Validate OTP format: Ensure it's a 6-digit number
  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(otp)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "OTP must be a 6-digit number" });
  }
  try {
    const [user] = await dbConnection.query(
      "SELECT * from users WHERE email=? AND otp=? AND otp_expires > ?",
      [email, otp, new Date()]
    );

    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid or Expired OTP" });
    }
    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  update the user's password and clear the OTP and it's expiration
    await dbConnection.query(
      "UPDATE users SET password=?, otp= NULL, otp_expires=NULL WHERE email=?",
      [hashedPassword, email]
    );

    return res.status(StatusCodes.OK).json({
      msg: "Password reset successfully. You can now log in with your new password",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error. Please try again later." });
  }
};

module.exports = {
  register,
  login,
  checkUser,
  requestOTP,
  resetPassword,
};
